import SanPham from "../models/SanPham.js";

//khởi tạo class
class SanPhamController {
  //API functions
  async apiList(req, res) {
    try {
      const sanPhams = await SanPham.find();
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: sanPhams,
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
      const sanPham = await SanPham.findById(id);
      res.status(200).json({
        message: "Thành công",
        data: sanPham,
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
      const deletedSanPham = await SanPham.findByIdAndDelete(id);
      res.status(200).json({
        message: "Xóa thành công",
        data: deletedSanPham,
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
      const { error } = sanPhamValidator.validate(req.body, {
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
      const newSanPham = await SanPham.create(data);
      res.status(200).json({
        message: "Thành công",
        data: newSanPham,
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
      const { error } = sanPhamValidator.validate(req.body, {
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
      const sanPham = await SanPham.findByIdAndUpdate(id, data);
      res.status(200).json({
        message: "Thành công",
        data: sanPham,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật sách",
        error: error.message,
      });
    }
  }
}

export default SanPhamController;
