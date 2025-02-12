import mongoose from "mongoose";

// Schema chi tiết hóa đơn (Không có tham chiếu)
const chiTietHoaDonSchema = new mongoose.Schema({
  MaHD: {
    type: String,
    required: true,
  },
  MaSP: {
    type: String,
    required: true,
  },
  SoLuong: {
    type: Number,
    required: true,
  },
  TongTien: {
    type: Number,
    required: true,
  },
  TrangThai: {
    type: String,
    required: true,
  },
  MaCTHD: {
    type: String,
    required: true,
    unique: true,
  },
});

// Tạo model từ schema
const ChiTietHoaDon = mongoose.model("chitiethoadon", chiTietHoaDonSchema);
export default ChiTietHoaDon;
