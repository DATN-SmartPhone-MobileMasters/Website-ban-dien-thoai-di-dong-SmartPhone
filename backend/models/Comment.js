import mongoose from "mongoose";

// Schema bình luận
const binhLuanSchema = new mongoose.Schema({
  SoThuTu: {
    type: Number,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  MaBL: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  MaND: {
    type: String,
    ref: "users", // Tham chiếu đến bảng User
    required: true,
  },
  MaSP: {
    type: String,
    ref: "Sanpham", // Tham chiếu đến bảng SanPham
    required: true,
  },
  NoiDung: {
    type: String,
    required: true,
  },
  DanhGia: {
    type: Number,
    required: true,
  },
  NgayBL: {
    type: Date,
    default: Date.now,
  },
});

const Binhluan = mongoose.model("binhluan", binhLuanSchema);
export default Binhluan;
