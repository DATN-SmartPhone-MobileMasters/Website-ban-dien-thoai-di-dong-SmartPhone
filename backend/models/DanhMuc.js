import mongoose from "mongoose"; //kết nối với CSDL

const danhMucSchema = new mongoose.Schema({
  TenDM: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const danhmuc = mongoose.model("danhmuc", danhMucSchema);
export default danhmuc;
