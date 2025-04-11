import hoadon from "../models/HoaDon.js";
import SanPham from "../models/SanPham.js"; // Thêm import SanPham
import crypto from "crypto";
import moment from "moment";

class HoaDonController {
  // Lấy danh sách hóa đơn
  async apiList(req, res) {
    try {
      const hoaDons = await hoadon.find();
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: hoaDons,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      });
    }
  }

  // Lấy chi tiết hóa đơn theo ID
  async apiDetail(req, res) {
    try {
      const id = req.params.id;
      const hoaDon = await hoadon.findById(id);
      if (!hoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy hóa đơn",
        });
      }

      res.status(200).json({
        message: "Thành công",
        data: hoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy chi tiết",
        error: error.message,
      });
    }
  }

  // Lấy danh sách hóa đơn theo user ID
  async apiListByUserId(req, res) {
    try {
      const userId = req.params.userId;
      const hoaDons = await hoadon.find({ userId: userId });
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: hoaDons,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      });
    }
  }

  // Tạo hóa đơn mới
  async apiCreate(req, res) {
    try {
      // Đặt trạng thái mặc định là "Chờ xử lý" nếu không được cung cấp
      if (!req.body.paymentStatus) {
        req.body.paymentStatus = "Chờ xử lý";
      }

      // Lấy danh sách sản phẩm từ request body
      const { products } = req.body;
      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          message: "Danh sách sản phẩm không hợp lệ",
        });
      }

      // Tạo mảng để lưu các cập nhật sản phẩm
      const productUpdates = [];

      // Duyệt qua từng sản phẩm trong đơn hàng
      for (const product of products) {
        const { productId, memory, quantity } = product;

        // Kiểm tra dữ liệu đầu vào
        if (!productId || !memory || !quantity || quantity <= 0) {
          return res.status(400).json({
            message: "Thông tin sản phẩm không hợp lệ",
          });
        }

        // Tìm sản phẩm trong cơ sở dữ liệu
        const sanPham = await SanPham.findById(productId);
        if (!sanPham) {
          return res.status(404).json({
            message: `Không tìm thấy sản phẩm với ID ${productId}`,
          });
        }

        // Xác định trường số lượng cần cập nhật dựa trên memory
        let quantityField = null;
        if (memory === sanPham.BoNhoTrong1) {
          quantityField = "SoLuong1";
        } else if (memory === sanPham.BoNhoTrong2) {
          quantityField = "SoLuong2";
        } else if (memory === sanPham.BoNhoTrong3) {
          quantityField = "SoLuong3";
        } else {
          return res.status(400).json({
            message: `Biến thể bộ nhớ ${memory} không hợp lệ cho sản phẩm ${sanPham.TenSP}`,
          });
        }

        // Kiểm tra số lượng tồn kho
        const currentQuantity = sanPham[quantityField];
        if (currentQuantity < quantity) {
          return res.status(400).json({
            message: `Số lượng tồn kho không đủ cho sản phẩm ${sanPham.TenSP} (${memory})`,
          });
        }

        // Tạo bản cập nhật cho sản phẩm
        productUpdates.push({
          productId,
          quantityField,
          newQuantity: currentQuantity - quantity,
        });
      }

      // Cập nhật số lượng sản phẩm trong cơ sở dữ liệu
      for (const update of productUpdates) {
        await SanPham.findByIdAndUpdate(
          update.productId,
          { [update.quantityField]: update.newQuantity },
          { runValidators: true }
        );
      }

      // Tạo và lưu đơn hàng mới
      const newOrder = new hoadon(req.body);
      const savedOrder = await newOrder.save();

      res.status(201).json({
        message: "Tạo hóa đơn thành công",
        data: savedOrder,
      });
    } catch (error) {
      res.status(400).json({
        message: "Lỗi khi tạo hóa đơn",
        error: error.message,
      });
    }
  }

  // Chỉnh sửa hóa đơn
  async apiEdit(req, res) {
    try {
      const id = req.params.id;
      const updates = req.body;
      const hoaDon = await hoadon.findById(id);
  
      if (!hoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy hóa đơn để cập nhật",
        });
      }
  
      // Nếu trạng thái mới là "Huỷ Đơn" và trạng thái hiện tại là "Chờ xử lý" hoặc "Đã Xác Nhận"
      if (
        updates.paymentStatus === "Huỷ Đơn" &&
        ["Chờ xử lý", "Đã Xác Nhận"].includes(hoaDon.paymentStatus)
      ) {
        // Lấy danh sách sản phẩm từ đơn hàng
        const { products } = hoaDon;
        if (products && Array.isArray(products)) {
          for (const product of products) {
            const { productId, memory, quantity } = product;
  
            // Tìm sản phẩm trong cơ sở dữ liệu
            const sanPham = await SanPham.findById(productId);
            if (!sanPham) {
              return res.status(404).json({
                message: `Không tìm thấy sản phẩm với ID ${productId}`,
              });
            }
  
            // Xác định trường số lượng cần cập nhật dựa trên memory
            let quantityField = null;
            if (memory === sanPham.BoNhoTrong1) {
              quantityField = "SoLuong1";
            } else if (memory === sanPham.BoNhoTrong2) {
              quantityField = "SoLuong2";
            } else if (memory === sanPham.BoNhoTrong3) {
              quantityField = "SoLuong3";
            } else {
              return res.status(400).json({
                message: `Biến thể bộ nhớ ${memory} không hợp lệ cho sản phẩm ${sanPham.TenSP}`,
              });
            }
  
            // Cộng lại số lượng đã trừ trước đó
            const currentQuantity = sanPham[quantityField];
            await SanPham.findByIdAndUpdate(
              productId,
              { [quantityField]: currentQuantity + quantity },
              { runValidators: true }
            );
          }
        }
      }
  
      // Cập nhật hóa đơn
      const updatedHoaDon = await hoadon.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
  
      res.status(200).json({
        message: "Cập nhật hóa đơn thành công",
        data: updatedHoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật hóa đơn",
        error: error.message,
      });
    }
  }

  // Xóa hóa đơn
  async apiDelete(req, res) {
    try {
      const id = req.params.id;
      const deletedHoaDon = await hoadon.findByIdAndDelete(id);

      if (!deletedHoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy hóa đơn để xóa",
        });
      }

      res.status(200).json({
        message: "Xóa hóa đơn thành công",
        data: deletedHoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa hóa đơn",
        error: error.message,
      });
    }
  }

  // Thống kê doanh thu
  async thongKeDoanhThu(req, res) {
    try {
      const matchCompletedOrders = { $match: { paymentStatus: "Hoàn thành" } };

      const doanhThuTheoNgay = await hoadon.aggregate([
        matchCompletedOrders,
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            tongDoanhThu: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const doanhThuTheoTuan = await hoadon.aggregate([
        matchCompletedOrders,
        {
          $group: {
            _id: { $week: "$createdAt" },
            tongDoanhThu: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const doanhThuTheoThang = await hoadon.aggregate([
        matchCompletedOrders,
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            tongDoanhThu: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const doanhThuTheoNam = await hoadon.aggregate([
        matchCompletedOrders,
        {
          $group: {
            _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
            tongDoanhThu: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const tongDoanhThuTheoNgay = doanhThuTheoNgay.reduce(
        (acc, item) => acc + item.tongDoanhThu,
        0
      );
      const tongDoanhThuTheoTuan = doanhThuTheoTuan.reduce(
        (acc, item) => acc + item.tongDoanhThu,
        0
      );

      res.status(200).json({
        doanhThuTheoNgay,
        doanhThuTheoTuan,
        doanhThuTheoThang,
        doanhThuTheoNam,
        tongDoanhThuTheoNgay,
        tongDoanhThuTheoTuan,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Tạo thanh toán VNPay
  async apiCreateVNPayPayment(req, res) {
    try {
      const { amount, orderId, orderInfo, returnUrl } = req.body;

      // Validate input
      if (!amount || !orderId || !orderInfo || !returnUrl) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate environment variables
      if (
        !process.env.VNP_TMNCODE ||
        !process.env.VNP_HASH_SECRET ||
        !process.env.VNP_URL
      ) {
        throw new Error("VNPay configuration is missing");
      }

      const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.ip ||
        req.connection.remoteAddress;

      // Create parameters object
      const vnpParams = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: process.env.VNP_TMNCODE,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "other",
        vnp_Amount: Math.floor(amount * 100),
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: moment().format("YYYYMMDDHHmmss"),
      };

      // Sort parameters alphabetically
      const sortedParams = {};
      Object.keys(vnpParams)
        .sort()
        .forEach((key) => {
          sortedParams[key] = vnpParams[key];
        });

      // Create query string for signing
      const signData = new URLSearchParams(sortedParams).toString();

      // Create secure hash
      const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
      const signed = hmac.update(signData).digest("hex");

      // Add secure hash to parameters
      const finalParams = {
        ...sortedParams,
        vnp_SecureHash: signed,
      };

      // Build payment URL
      const paymentUrl =
        process.env.VNP_URL +
        "?" +
        Object.keys(finalParams)
          .map((key) => `${key}=${encodeURIComponent(finalParams[key])}`)
          .join("&");

      res.status(200).json({
        message: "Payment URL generated successfully",
        paymentUrl,
      });
    } catch (error) {
      console.error("VNPay Error:", error);
      res.status(500).json({
        message: "Error creating VNPay payment",
        error: error.message,
      });
    }
  }

  // Xử lý kết quả trả về từ VNPay
  async apiHandleVNPayReturn(req, res) {
    try {
      const {
        vnp_TxnRef,
        vnp_ResponseCode,
        vnp_TransactionNo,
      } = req.query;

      // Validate required fields
      if (!vnp_TxnRef || !vnp_ResponseCode) {
        return res.status(400).json({
          success: false,
          message: "Thiếu tham số bắt buộc từ VNPay",
        });
      }

      // Find and update the order
      const order = await hoadon.findByIdAndUpdate(
        vnp_TxnRef,
        {
          paymentStatus: vnp_ResponseCode === "00" ? "Chờ xử lý" : "Huỷ Đơn",
          vnp_TransactionNo,
          vnp_ResponseCode,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      res.json({
        success: true,
        orderId: order._id,
        paymentStatus: order.paymentStatus,
      });
    } catch (error) {
      console.error("VNPay return processing error:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi hệ thống khi xử lý kết quả thanh toán",
      });
    }
  }
}

export default HoaDonController;