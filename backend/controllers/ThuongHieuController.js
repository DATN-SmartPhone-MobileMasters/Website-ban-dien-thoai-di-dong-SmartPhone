import thuonghieu from "../models/ThuongHieu.js";

//khởi tạo class
class ThuongHieuController {
  //API functions
  async apiList(req, res) {
    try {
      // Sử dụng populate để lấy thông tin từ danh mục
      const thuongHieus = await thuonghieu.find().populate("MaDM", "TenDM");
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

  async apiDelete(req, res) {
    try {
      const id = req.params.id;
      const deletedThuongHieu = await thuonghieu.findByIdAndDelete(id);
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

  async apiDetail(req, res) {
  try {
    const id = req.params.id;

    // Sử dụng populate để lấy tên danh mục
    const thuongHieu = await thuonghieu.findById(id).populate("MaDM", "TenDM");

    if (!thuongHieu) {
      return res.status(404).json({
        message: "Không tìm thấy thương hiệu",
      });
    }

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


  async apiCreate(req, res) {
    try {
      const data = req.body;
      const newThuongHieu = await thuonghieu.create(data);
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
      const thuongHieu = await thuonghieu.findByIdAndUpdate(id, data).populate("MaDM", "TenDM");
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
