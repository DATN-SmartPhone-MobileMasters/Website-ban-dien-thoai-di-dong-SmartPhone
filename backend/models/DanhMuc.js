import mongoose from "mongoose";

const DanhMucSchema = new mongoose.Schema({
  MaDM: { type: String }, // Mã danh mục
  TenDM: { type: String, required: true }, // Tên danh mục
  SanPham: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SanPham", // Đảm bảo tên model là "SanPham"
    },
  ], // Danh sách sản phẩm thuộc danh mục
  created_at: { type: Date, default: Date.now }, // Thời gian tạo
});

// Tạo model danh mục
const danhmuc = mongoose.model("DanhMuc", DanhMucSchema);
export default danhmuc;
