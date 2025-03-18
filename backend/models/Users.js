import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  MaND: {
    type: String,
  },
  HoVaTen: {
    type: String,
  },
  Avata:{
    type: String,
  },
  GioiTinh: {
    type: String,
  },
  SDT: {
    type: Number,
  },
  Email: {
    type: String,
  },
  DiaChi: {
    type: String,
  },
  TaiKhoan: {
    type: String,
  },
  MatKhau: {
    type: String,
  },
  MaQuyen: {
    type: Number,
  },
  TrangThai: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Users = mongoose.model("users", userSchema);
export default Users;
