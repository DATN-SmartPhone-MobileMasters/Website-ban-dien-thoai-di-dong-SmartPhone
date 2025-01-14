import mongoose from "mongoose";


const thuongHieuSchema = new mongoose.Schema({
  TenTH: { type: String, required: true },
  HinhAnh: { type: String },
  Mota: { type: String },
  MaDM: { type: mongoose.Schema.Types.ObjectId, ref: "danhmuc" }, // Tham chiếu tới bảng "danhmuc"
  created_at: { type: Date, default: Date.now },
});

const thuonghieu = mongoose.model("thuonghieu", thuongHieuSchema);
export default thuonghieu;

