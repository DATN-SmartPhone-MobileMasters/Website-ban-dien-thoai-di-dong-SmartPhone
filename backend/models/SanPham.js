import mongoose from "mongoose";

//schema sản phẩm

const sanPhamSchema = new mongoose.Schema({
  MaTH: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "thuonghieu", // Tham chiếu đến bảng Thuonghieu
    required: true,
  },
  MaDM: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "danhmuc", // Tham chiếu đến bảng Danhmuc
    required: true,
  },
  MaKM: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "khuyenmai", // Tham chiếu đến bảng Khuyenmai
  },
  TenSP: {
    type: String,
    required: true,
  },
  GiaSP: {
    type: Number,
    required: true,
  },
  SoLuong: {
    type: Number,
    default: 0,
  },
  MoTa: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const sanpham = mongoose.model("sanpham", sanPhamSchema);
export default sanpham;
