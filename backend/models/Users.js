import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  MaND: {
    type: String,
    required: true,
    unique: true
  },
  HoVaTen: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  GioiTinh: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    required: true
  },
  SDT: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  DiaChi: {
    type: String,
    required: true
  },
  TaiKhoan: {
    type: String,
    required: true,
    unique: true
  },
  MatKhau: {
    type: String,
    required: true
  },
  MaQuyen: {
    type: Number,
    required: true
  },
  TrangThai: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Users = mongoose.model("users", userSchema);
export default Users;

