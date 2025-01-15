import mongoose from "mongoose";

//schema bình luận

const binhLuanSchema = new mongoose.Schema({
  MaBL: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  MaND: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "nguoidung", // Tham chiếu đến bảng NguoiDung
    required: true,
  },
  MaSP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sanpham", // Tham chiếu đến bảng SanPham
    required: true,
  },
  NoiDung: {
    type: String,
    required: true,
  },
  NgayBL: {
    type: Date,
    default: Date.now,
  },
});

const Binhluan = mongoose.model("binhluan", binhLuanSchema);
export default Binhluan;
