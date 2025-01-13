import ThuongHieu from "../models/ThuongHieu.js";

//khởi tạo class
class ThuongHieuController {
  //API functions
  async apiList(req, res) {
    try {
      const thuongHieus = await ThuongHieu.find();
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: thuongHieus,
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
      const thuongHieu = await ThuongHieu.findById(id);
      res.status(200).json({
        message: "Thành công",
        data: thuongHieu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy chi tiết",
        error: error.message,
      });
    }
  }

  async apiDelete(req, res) {
    try {
      const id = req.params.id;
      const deletedThuongHieu = await ThuongHieu.findByIdAndDelete(id);
      res.status(200).json({
        message: "Xóa thành công",
        data: deletedThuongHieu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa",
        error: error.message,
      });
    }
  }

  async apiCreate(req, res) {
    try {
      const data = req.body;
      const newThuongHieu = await ThuongHieu.create(data);
      res.status(200).json({
        message: "Thành công",
        data: newThuongHieu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tạo",
        error: error.message,
      });
    }
  }

  async apiUpdate(req, res) {
    try {
      const id = req.params.id;
      const data = req.body;
      const thuongHieu = await ThuongHieu.findByIdAndUpdate(id, data);
      res.status(200).json({
        message: "Thành công",
        data: thuongHieu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật",
        error: error.message,
      });
    }
  }
}

export default ThuongHieuController;
