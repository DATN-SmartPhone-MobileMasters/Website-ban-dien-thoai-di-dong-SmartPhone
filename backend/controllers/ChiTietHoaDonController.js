import ChiTietHoaDon from "../models/Chitiethoadon.js";

class ChiTietHoaDonController {
  async apiList(req, res) {
    try {
      const chiTietHoaDons = await ChiTietHoaDon.find();
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: chiTietHoaDons,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      });
    }
  }

  async apiDetail(req, res) {
    try {
      const id = req.params.id;
      const chiTietHoaDon = await ChiTietHoaDon.findById(id);
      if (!chiTietHoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy chi tiết hóa đơn",
        });
      }
      res.status(200).json({
        message: "Thành công",
        data: chiTietHoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy chi tiết",
        error: error.message,
      });
    }
  }

  async apiCreate(req, res) {
    try {
      const data = req.body;
      const newChiTietHoaDon = await ChiTietHoaDon.create(data);
      res.status(200).json({
        message: "Tạo chi tiết hóa đơn thành công",
        data: newChiTietHoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tạo chi tiết hóa đơn",
        error: error.message,
      });
    }
  }

  async apiUpdate(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const updatedChiTietHoaDon = await ChiTietHoaDon.findByIdAndUpdate(id, data, {
        new: true,
      });
      res.status(200).json({
        message: "Cập nhật thành công",
        data: updatedChiTietHoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật",
        error: error.message,
      });
    }
  }

  async apiDelete(req, res) {
    try {
      const id = req.params.id;
      const deletedChiTietHoaDon = await ChiTietHoaDon.findByIdAndDelete(id);
      if (!deletedChiTietHoaDon) {
        return res.status(404).json({
          message: "Không tìm thấy chi tiết hóa đơn để xóa",
        });
      }
      res.status(200).json({
        message: "Xóa thành công",
        data: deletedChiTietHoaDon,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa",
        error: error.message,
      });
    }
  }
}

export default ChiTietHoaDonController;
