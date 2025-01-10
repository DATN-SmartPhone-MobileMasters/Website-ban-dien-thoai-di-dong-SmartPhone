import mongoose from "mongoose";

//schema sản phẩm

const danhMucSchema = new mongoose.Schema({
  MaDM: {
    // type: mongoose.Schema.Types.ObjectId,
    type: Number,
    ref: "sanpham", // Tham chiếu đến bảng sanpham
    required: true,
  },
  TenDM: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Danhmuc = mongoose.model("danhmuc", danhMucSchema);
export default Danhmuc;
