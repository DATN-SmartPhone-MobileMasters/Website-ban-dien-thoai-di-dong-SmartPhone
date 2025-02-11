import mongoose from "mongoose";

const ChiTietSanPhamHoaDonSchema = new mongoose.Schema({
  MaCTHD: { type: String, required: true, unique: true }, // Mã chi tiết hóa đơn
  MaHD: { type: String, required: true }, // Mã hóa đơn
  MaSP: { type: String, required: true }, // Mã sản phẩm
  SoLuong: { type: Number, required: true }, // Số lượng sản phẩm
  TongTien: { type: Number, required: true }, // Tổng tiền
  HinhAnh: { type: String, required: false }, // Hình ảnh sản phẩm (URL hoặc đường dẫn)
  TrangThai: { type: String, enum: ["Đã xác nhận", "Chưa xác nhận"], default: "Chưa xác nhận" }, // Trạng thái
  created_at: { type: Date, default: Date.now }, // Thời gian tạo
});

// Tạo model chi tiết sản phẩm hóa đơn
const ChiTietSanPhamHoaDon = mongoose.model("ChiTietSanPhamHoaDon", ChiTietSanPhamHoaDonSchema);

export default ChiTietSanPhamHoaDon;
