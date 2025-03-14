import hoadon from "../models/HoaDon.js";

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
      const hoaDons = await hoadon.find({ userId: userId }); // Use `find` to get an array
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: hoaDons, // This will be an array (even if empty or has one item)
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      });
    }
  }

  async apiCreate(req, res) {
    try {
      const newOrder = new hoadon(req.body);
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Chỉnh sửa hóa đơn
  async apiEdit(req, res) {
    try {
      const id = req.params.id;
      const updates = req.body;
      const hoaDon = await hoadon.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!hoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy hóa đơn để cập nhật",
        });
      }

      res.status(200).json({
        message: "Cập nhật hóa đơn thành công",
        data: hoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật hóa đơn",
        error: error.message,
      });
    }
  }
}

export default HoaDonController;
