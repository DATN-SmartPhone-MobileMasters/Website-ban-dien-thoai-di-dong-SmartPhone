import hoadon from "../models/HoaDon.js"
import crypto from "crypto"
import moment from "moment"

class HoaDonController {
  // Lấy danh sách hóa đơn
  async apiList(req, res) {
    try {
      const hoaDons = await hoadon.find()
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: hoaDons,
      })
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      })
    }
  }

  // Lấy chi tiết hóa đơn theo ID
  async apiDetail(req, res) {
    try {
      const id = req.params.id
      const hoaDon = await hoadon.findById(id)
      if (!hoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy hóa đơn",
        })
      }

      res.status(200).json({
        message: "Thành công",
        data: hoaDon,
      })
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy chi tiết",
        error: error.message,
      })
    }
  }

  // Lấy danh sách hóa đơn theo user ID
  async apiListByUserId(req, res) {
    try {
      const userId = req.params.userId
      const hoaDons = await hoadon.find({ userId: userId }) // Use `find` to get an array
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: hoaDons, // This will be an array (even if empty or has one item)
      })
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      })
    }
  }

  async apiCreate(req, res) {
    try {
      const newOrder = new hoadon(req.body)
      const savedOrder = await newOrder.save()
      res.status(201).json(savedOrder)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  // Chỉnh sửa hóa đơn
  async apiEdit(req, res) {
    try {
      const id = req.params.id
      const updates = req.body
      const hoaDon = await hoadon.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      })

      if (!hoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy hóa đơn để cập nhật",
        })
      }

      res.status(200).json({
        message: "Cập nhật hóa đơn thành công",
        data: hoaDon,
      })
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật hóa đơn",
        error: error.message,
      })
    }
  }
  async apiDelete(req, res) {
    try {
      const id = req.params.id
      const deletedHoaDon = await hoadon.findByIdAndDelete(id)

      if (!deletedHoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy hóa đơn để xóa",
        })
      }

      res.status(200).json({
        message: "Xóa hóa đơn thành công",
        data: deletedHoaDon,
      })
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa hóa đơn",
        error: error.message,
      })
    }
  }

  // Thống kê doanh thu
  async thongKeDoanhThu(req, res) {
    try {
      const matchCompletedOrders = { $match: { paymentStatus: "Hoàn thành" } }

      const doanhThuTheoNgay = await hoadon.aggregate([
        matchCompletedOrders,
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            tongDoanhThu: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ])

      const doanhThuTheoTuan = await hoadon.aggregate([
        matchCompletedOrders,
        {
          $group: {
            _id: { $week: "$createdAt" }, // Lấy số tuần trong năm
            tongDoanhThu: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ])

      const doanhThuTheoThang = await hoadon.aggregate([
        matchCompletedOrders,
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            tongDoanhThu: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ])

      const doanhThuTheoNam = await hoadon.aggregate([
        matchCompletedOrders,
        {
          $group: {
            _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
            tongDoanhThu: { $sum: "$total" },
          },
        },
        { $sort: { _id: 1 } },
      ])

      const tongDoanhThuTheoNgay = doanhThuTheoNgay.reduce((acc, item) => acc + item.tongDoanhThu, 0)
      const tongDoanhThuTheoTuan = doanhThuTheoTuan.reduce((acc, item) => acc + item.tongDoanhThu, 0)

      res.status(200).json({
        doanhThuTheoNgay,
        doanhThuTheoTuan,
        doanhThuTheoThang,
        doanhThuTheoNam,
        tongDoanhThuTheoNgay,
        tongDoanhThuTheoTuan,
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  async apiCreateVNPayPayment(req, res) {
    try {
      const { amount, orderId, orderInfo, returnUrl } = req.body

      // Validate input
      if (!amount || !orderId || !orderInfo || !returnUrl) {
        return res.status(400).json({ message: "Missing required fields" })
      }

      // Validate environment variables
      if (!process.env.VNP_TMNCODE || !process.env.VNP_HASH_SECRET || !process.env.VNP_URL) {
        throw new Error("VNPay configuration is missing")
      }

      const ipAddr = req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress

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
        vnp_Amount: Math.floor(amount * 100), // VNPay expects amount in VND subunits
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: moment().format("YYYYMMDDHHmmss"),
      }

      // Sort parameters alphabetically
      const sortedParams = {}
      Object.keys(vnpParams)
        .sort()
        .forEach((key) => {
          sortedParams[key] = vnpParams[key]
        })

      // Create query string for signing
      const signData = new URLSearchParams(sortedParams).toString()

      // Create secure hash
      const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET)
      const signed = hmac.update(signData).digest("hex")

      // Add secure hash to parameters
      const finalParams = {
        ...sortedParams,
        vnp_SecureHash: signed,
      }

      // Build payment URL
      const paymentUrl =
        process.env.VNP_URL +
        "?" +
        Object.keys(finalParams)
          .map((key) => `${key}=${encodeURIComponent(finalParams[key])}`)
          .join("&")

      res.status(200).json({
        message: "Payment URL generated successfully",
        paymentUrl,
      })
    } catch (error) {
      console.error("VNPay Error:", error)
      res.status(500).json({
        message: "Error creating VNPay payment",
        error: error.message,
      })
    }
  }
  // Thêm vào HoaDonController.js
// controllers/HoaDonController.js
async apiHandleVNPayReturn(req, res) {
  try {
    const { 
      vnp_TxnRef, // orderId
      vnp_ResponseCode,
      vnp_TransactionNo,
      // other VNPay params
    } = req.query;

    // Validate required fields
    if (!vnp_TxnRef || !vnp_ResponseCode) {
      return res.status(400).json({ 
        success: false,
        message: "Thiếu tham số bắt buộc từ VNPay" 
      });
    }

    // Find and update the order
    const order = await hoadon.findByIdAndUpdate(
      vnp_TxnRef,
      {
        paymentStatus: vnp_ResponseCode === '00' ? 'Chờ xử lý' : 'Huỷ Đơn',
        vnp_TransactionNo,
        vnp_ResponseCode,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    res.json({
      success: true,
      orderId: order._id,
      paymentStatus: order.paymentStatus
    });

  } catch (error) {
    console.error('VNPay return processing error:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi xử lý kết quả thanh toán"
    });
  }
}
}

export default HoaDonController

