import KhuyenMai from "../models/KhuyenMai.js";

//khởi tạo class
class KhuyenMaiController {
  //API functions
  async apiList(req, res) {
    try {
      const khuyenMais = await KhuyenMai.find();
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: khuyenMais,
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
      const khuyenMai = await KhuyenMai.findById(id);
      res.status(200).json({
        message: "Thành công",
        data: khuyenMai,
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
      const deletedKhuyenMai = await KhuyenMai.findByIdAndDelete(id);
      res.status(200).json({
        message: "Xóa thành công",
        data: deletedKhuyenMai,
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
      const { error } = khuyenMaiValidator.validate(req.body, {
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
      const newKhuyenMai = await KhuyenMai.create(data);
      res.status(200).json({
        message: "Thành công",
        data: newKhuyenMai,
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
      const { error } = khuyenMaiValidator.validate(req.body, {
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
      const khuyenMai = await KhuyenMai.findByIdAndUpdate(id, data);
      res.status(200).json({
        message: "Thành công",
        data: khuyenMai,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật sách",
        error: error.message,
      });
    }
  }
}

export default KhuyenMaiController;
