import Danhmuc from "../models/DanhMuc.js";

//khởi tạo class
class DanhmucController {
  //API functions
  async apiList(req, res) {
    try {
      const danhmucs = await Danhmuc.find();
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: danhmucs,
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
      const danhmuc = await Danhmuc.findById(id);
      res.status(200).json({
        message: "Thành công",
        data: danhmuc,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy chi tiết sách",
        error: error.message,
      });
    }
  }

  async apiDelete(req, res) {
    try {
      const id = req.params.id;
      const deletedDanhmuc = await Danhmuc.findByIdAndDelete(id);
      res.status(200).json({
        message: "Xóa thành công",
        data: deletedDanhmuc,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa sách",
        error: error.message,
      });
    }
  }

  async apiCreate(req, res) {
    try {
      const { error } = danhmucValidator.validate(req.body, {
        abortEarly: false,
      });

      // Nếu có lỗi validation
      if (error) {
        // Lấy tất cả các lỗi và trả về cho người dùng
        const listErrors = error.details.map((item) => item.message);
        return res.status(400).json({
          message: listErrors,
        });
      }
      const data = req.body;
      const newDanhmuc = await Danhmuc.create(data);
      res.status(200).json({
        message: "Thành công",
        data: newDanhmuc,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tạo sách",
        error: error.message,
      });
    }
  }

  async apiUpdate(req, res) {
    try {
      const { error } = danhmucValidator.validate(req.body, {
        abortEarly: false,
      });

      // Nếu có lỗi validation
      if (error) {
        // Lấy tất cả các lỗi và trả về cho người dùng
        const listErrors = error.details.map((item) => item.message);
        return res.status(400).json({
          message: listErrors,
        });
      }
      const id = req.params.id;
      const data = req.body;
      const danhmuc = await Danhmuc.findByIdAndUpdate(id, data);
      res.status(200).json({
        message: "Thành công",
        data: danhmuc,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật sách",
        error: error.message,
      });
    }
  }
}

export default DanhmucController;
