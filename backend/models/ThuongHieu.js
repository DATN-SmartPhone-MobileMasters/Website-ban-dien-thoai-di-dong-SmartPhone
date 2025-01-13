import mongoose from "mongoose";

//schema sản phẩm

const thuongHieuSchema = new mongoose.Schema({
  TenTH: { type: String, required: true },
  HinhAnh: { type: String },
  Mota: { type: String },
  MaDM: { type: String, ref: "danhmuc" }, // tham chiếu đúng tên bảng
  created_at: { type: Date, default: Date.now },
});

const thuonghieu = mongoose.model("thuonghieu", thuongHieuSchema);
export default thuonghieu;
