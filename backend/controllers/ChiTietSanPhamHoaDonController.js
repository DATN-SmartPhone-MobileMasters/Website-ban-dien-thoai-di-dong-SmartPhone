import ChiTietSanPhamHoaDon from "../models/ChiTietSanPhamHoaDon.js";

class ChiTietSanPhamHoaDonController {
    // Lấy danh sách tất cả chi tiết sản phẩm trong hóa đơn
    async list(req, res) {
      try {
        const chiTietSanPham = await ChiTietSanPhamHoaDon.find();
        res.status(200).json(chiTietSanPham);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    // Lấy chi tiết sản phẩm trong hóa đơn theo ID
    async detail(req, res) {
      try {
        const chiTiet = await ChiTietSanPhamHoaDon.findById(req.params.id);
        if (!chiTiet)
          return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
  
        res.status(200).json({ data: chiTiet });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  }
  
  export default ChiTietSanPhamHoaDonController;