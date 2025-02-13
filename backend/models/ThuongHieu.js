import mongoose from "mongoose";

const ThuongHieuSchema = new mongoose.Schema({
  MaTH: { type: String, unique: true, sparse: true },
  TenTH: { type: String, required: true },
  HinhAnh: { type: String },
  Mota: { type: String },
  MaDM: [{ type: mongoose.Schema.Types.ObjectId, ref: "DanhMuc" }], // Nhiều danh mục
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("ThuongHieu", ThuongHieuSchema);
