import mongoose from "mongoose";

// Schema bình luận
const binhLuanSchema = new mongoose.Schema({
  Email: {
    type: String,
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
  Reply: {
    Content: { type: String },
    Date: { type: Date },
    AdminEmail: { type: String },
  },
  NgayBL: {
    type: Date,
    default: Date.now,
  },
});

const Binhluan = mongoose.model("binhluan", binhLuanSchema);
export default Binhluan;
