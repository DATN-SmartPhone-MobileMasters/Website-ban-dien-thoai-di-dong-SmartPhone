import mongoose from 'mongoose';

const ThuongHieuSchema = new mongoose.Schema({
  TenTH: { type: String, required: true }, // Tên thương hiệu
  HinhAnh: { type: String }, // Hình ảnh
  Mota: { type: String }, // Mô tả
  MaDM: { 
    type: mongoose.Schema.Types.ObjectId, // Đảm bảo là ObjectId
    ref: 'DanhMuc', // Tham chiếu đến model 'DanhMuc'
  },
  created_at: { type: Date, default: Date.now }, // Thời gian tạo
});

export default mongoose.model('ThuongHieu', ThuongHieuSchema);
