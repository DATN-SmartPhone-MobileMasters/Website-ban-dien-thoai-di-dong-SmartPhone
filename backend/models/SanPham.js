import mongoose from "mongoose";

const SanphamSchema = new mongoose.Schema({
  MaSP: String,
  MaTH: String,
  MaDM: String,
  MaKM: String,
  TenSP1: String,
  TenSP2: String,
  TenSP3: String,
  SoLuong1: Number,
  SoLuong2: Number,
  SoLuong3: Number,
  HinhAnh1: String,
  HinhAnh2: String,
  HinhAnh3: String,
  GiaSP1:Number,
  GiaSP2:Number,
  GiaSP3:Number,
  BoNhoTrong: String,
  Mau1: String,
  Mau2: String,
  Mau3: String,
  ManHinh: String,
  HDH: String,
  CamSau: String,
  CamTruoc: String,
  Chipset: String,
  CPU: String,
  TrangThai: String,
  Pin: String,
  created_at: { type: Date, default: Date.now },
});

const Sanpham = mongoose.model("Sanpham", SanphamSchema);

export default Sanpham;
