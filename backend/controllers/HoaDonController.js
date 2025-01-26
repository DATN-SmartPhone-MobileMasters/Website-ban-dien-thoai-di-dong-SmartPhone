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

  // Chỉnh sửa hóa đơn
  async apiEdit(req, res) {
    try {
      const id = req.params.id;  // Lấy ID hóa đơn từ tham số URL
      const updates = req.body;  // Lấy dữ liệu chỉnh sửa từ body của request

      // Cập nhật hóa đơn theo ID và dữ liệu mới
      const hoaDon = await hoadon.findByIdAndUpdate(id, updates, { 
        new: true,       // Trả về dữ liệu đã cập nhật
        runValidators: true // Kiểm tra dữ liệu có hợp lệ theo schema không
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