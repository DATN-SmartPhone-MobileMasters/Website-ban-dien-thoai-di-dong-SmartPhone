import mongoose from "mongoose";

const SanphamSchema = new mongoose.Schema({
  MaSP: String,
  MaTH: String,
  MaDM: String,
  MaKM: String,
  TenSP: String,
  GiaSP: Number,
  SoLuong: Number,
  HinhAnh1: String,
  BoNhoTrong: String,
  Mau: String,
  ManHinh: String,
  MoTa: String,
  created_at: { type: Date, default: Date.now },
});

const Sanpham = mongoose.model("Sanpham", SanphamSchema);

export default Sanpham;
