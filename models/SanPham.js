import mongoose from "mongoose";
const sanPhamSchema = new mongoose.Schema({
  MaSP: {
    type: Number,
    required: true,
  },
  MaTH: {
    type: Number,
    required: true,
  },
  MaDM: {
    type: Number,
    required: true,
  },
  MaKM: {
    type: Number,
    required: true,
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
    required: true,
  },
  HinhAnh1: {
    type: String,
    required: true,
  },
  HinhAnh2: {
    type: String,
    required: true,
  },
  HinhAnh3: {
    type: String,
    required: true,
  },
  BoNhoTrong: {
    type: String,
    required: true,
  },
  Mau: {
    type: String,
    required: true,
  },
  ManHinh: {
    type: String,
    required: true,
  },
  HDH: {
    type: String,
    required: true,
  },
  CamSau: {
    type: String,
    required: true,
  },
  CamTruoc: {
    type: String,
    required: true,
  },
  Chipset: {
    type: String,
    required: true,
  },
  CPU: {
    type: String,
    required: true,
  },
  Pin: {
    type: String,
    required: true,
  },
  MoTa: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const sanpham = mongoose.model("sanpham", sanPhamSchema);
export default sanpham;
