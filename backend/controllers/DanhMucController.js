import danhmuc from "../models/DanhMuc.js"; // Đảm bảo tên import trùng với export

class DanhMucController {
  async apiList(req, res) {
    try {
      const danhMucs = await danhmuc.find();
      res
        .status(200)
        .json({ message: "Lấy dữ liệu thành công", data: danhMucs });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy dữ liệu", error: error.message });
    }
  }

  async apiDelete(req, res) {
    try {
      const id = req.params.id;
      const deletedDanhMuc = await danhmuc.findByIdAndDelete(id);
      if (!deletedDanhMuc) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy danh mục để xóa" });
      }
      res.status(200).json({ message: "Xóa thành công", data: deletedDanhMuc });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
    }
  }

  async apiDetail(req, res) {
    try {
      const id = req.params.id;
      const danhMuc = await danhmuc.findById(id);
      if (!danhMuc) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      res.status(200).json({ message: "Thành công", data: danhMuc });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy chi tiết", error: error.message });
    }
  }

  async apiCreate(req, res) {
    try {
      const { TenDM } = req.body;
      if (!TenDM) {
        return res
          .status(400)
          .json({ message: "Tên danh mục không được để trống" });
      }

      // Kiểm tra danh mục đã tồn tại chưa
      const existingDanhMuc = await danhmuc.findOne({ TenDM });
      if (existingDanhMuc) {
        return res.status(400).json({ message: "Danh mục đã tồn tại" });
      }

      const newDanhMuc = await danhmuc.create({ TenDM });
      res
        .status(201)
        .json({ message: "Tạo danh mục thành công", data: newDanhMuc });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi tạo danh mục", error: error.message });
    }
  }

  async apiUpdate(req, res) {
    try {
      const id = req.params.id;
      const { TenDM } = req.body;
      if (!TenDM) {
        return res
          .status(400)
          .json({ message: "Tên danh mục không được để trống" });
      }

      // Kiểm tra danh mục trùng lặp khi cập nhật
      const existingDanhMuc = await danhmuc.findOne({
        TenDM,
        _id: { $ne: id },
      });
      if (existingDanhMuc) {
        return res.status(400).json({ message: "Danh mục đã tồn tại" });
      }

      const updatedDanhMuc = await danhmuc.findByIdAndUpdate(
        id,
        { TenDM },
        { new: true }
      );
      if (!updatedDanhMuc) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy danh mục để cập nhật" });
      }

      res
        .status(200)
        .json({ message: "Cập nhật thành công", data: updatedDanhMuc });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật", error: error.message });
    }
  }
}

export default DanhMucController;
