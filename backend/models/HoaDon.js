import mongoose from 'mongoose';

const HoaDonSchema = new mongoose.Schema({
  MaHD: { type: String, required: true }, // Mã hóa đơn
  MaND: { 
    type: mongoose.Schema.Types.ObjectId, // Đảm bảo là ObjectId
    ref: 'NguoiDung', // Tham chiếu đến model 'NguoiDung'
    required: true,
  },
  NgayLap: { type: Date, default: Date.now }, // Ngày lập hóa đơn
  NguoiNhan: { type: String, required: true }, // Người nhận
  SDT: { type: String, required: true }, // Số điện thoại
  DiaChi: { type: String, required: true }, // Địa chỉ giao hàng
  PhuongThucTT: { type: String, required: true }, // Phương thức thanh toán
  TongTien: { type: Number, required: true }, // Tổng tiền hóa đơn
  TrangThai: { type: String, default: 'Chờ xử lý' }, // Trạng thái hóa đơn
  NgayNhanHang: { type: Date }, // Ngày nhận hàng dự kiến
});

// Đặt tên model là 'HoaDon'
const hoadon = mongoose.model('HoaDon', HoaDonSchema);
export default hoadon;
