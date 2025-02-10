import thuonghieu from "../models/ThuongHieu.js";

//khởi tạo class
class ThuongHieuController {
  //API functions
  async apiList(req, res) {
    try {
      const thuongHieus = await thuonghieu.find().populate("MaDM", "TenDM").exec();

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
      const { id } = req.params;
      
      const thuongHieu = await thuonghieu.findById(id)
        .populate("MaDM", "TenDM") // Lấy danh mục của thương hiệu đó
        .exec();
  
      if (!thuongHieu) {
        return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
      }
  
      res.status(200).json({
        message: "Lấy dữ liệu thành công",
        data: thuongHieu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy dữ liệu",
        error: error.message,
      });
    }
  }
  
  async apiCreate(req, res) {
    try {
      const { MaTH, TenTH, HinhAnh, Mota, MaDM } = req.body;

      const newThuongHieu = await thuonghieu.create({
        MaTH,
        TenTH,
        HinhAnh,
        Mota,
        MaDM,
      });

      res.status(201).json({
        message: "Thêm thương hiệu thành công!",
        data: newThuongHieu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi tạo thương hiệu!",
        error: error.message,
      });
    }
  }

  async apiUpdate(req, res) {
    try {
      const id = req.params.id;
      const { MaTH, TenTH, HinhAnh, Mota, MaDM } = req.body;

      const thuongHieu = await thuonghieu
        .findByIdAndUpdate(
          id,
          { MaTH, TenTH, HinhAnh, Mota, MaDM },
          { new: true }
        )
        .populate("MaDM", "TenDM");

      res.status(200).json({
        message: "Cập nhật thương hiệu thành công!",
        data: thuongHieu,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi cập nhật!",
        error: error.message,
      });
    }
  }
}

export default ThuongHieuController;
