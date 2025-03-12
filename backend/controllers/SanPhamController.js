import SanPham from "../models/SanPham.js";

// Khởi tạo class
class SanPhamController {
  // API lấy danh sách sản phẩm
  async apiList(req, res) {
    try {
      const sanPhams = await SanPham.find().exec();
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

  // API xóa sản phẩm
  async apiDelete(req, res) {
    try {
      const id = req.params.id;
      const deletedSanPham = await SanPham.findByIdAndDelete(id);
      res.status(200).json({
        message: "Xóa sản phẩm thành công",
        data: deletedSanPham,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa sản phẩm",
        error: error.message,
      });
    }
  }

  // API lấy chi tiết sản phẩm
  async apiDetail(req, res) {
    try {
      const { id } = req.params;
      const sanPham = await SanPham.findById(id).exec();

      if (!sanPham) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: sanPham,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu sản phẩm",
        error: error.message,
      });
    }
  }

  // API tạo sản phẩm
  async apiCreate(req, res) {
    try {
      const newSanPham = await SanPham.create(req.body);
      res.status(201).json({
        message: "Thêm sản phẩm thành công!",
        data: newSanPham,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tạo sản phẩm!",
        error: error.message,
      });
    }
  }

  // API cập nhật sản phẩm
  async apiUpdate(req, res) {
    try {
      const id = req.params.id;
      const updatedSanPham = await SanPham.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json({
        message: "Cập nhật sản phẩm thành công!",
        data: updatedSanPham,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật sản phẩm!",
        error: error.message,
      });
    }
  }
}

export default SanPhamController;