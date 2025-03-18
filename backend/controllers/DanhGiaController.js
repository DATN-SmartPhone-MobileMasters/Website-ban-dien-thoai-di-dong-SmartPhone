import danhgia from "../models/DanhGia.js";

class DanhGiaController {
  // Lấy danh sách đánh giá
  async apiList(req, res) {
    try {
      const danhGias = await danhgia.find();
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: danhGias,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      });
    }
  }

  // Xóa đánh giá
  async apiDelete(req, res) {
    try {
      const id = req.params.id;
      const deletedDanhGia = await danhgia.findByIdAndDelete(id);
      res.status(200).json({
        message: "Xóa thành công",
        data: deletedDanhGia,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa",
        error: error.message,
      });
    }
  }

  // Tạo mới đánh giá
  async apiCreate(req, res) {
    try {
      const data = req.body; // Dữ liệu gửi từ client
      const newDanhGia = await danhgia.create(data); // Tạo mới đánh giá
      res.status(200).json({
        message: "Tạo đánh giá thành công",
        data: newDanhGia,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tạo đánh giá",
        error: error.message,
      });
    }
  }
}

export default DanhGiaController;