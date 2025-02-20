import mongoose from "mongoose";
const PromotionSchema = new mongoose.Schema(
  {
    MaKM: { type: String, required: true, unique: true }, // Mã khuyến mãi
    TenKM: { type: String, required: true }, // Tên khuyến mãi
    LoaiKM: {
      type: String,
      required: true,
      enum: ["fixed", "percentage"], // Chỉ cho phép 2 loại này
    },
    GiaTriKM: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          if (this.LoaiKM === "percentage") {
            return value >= 0 && value <= 100;
          }
          return value >= 0; // Nếu là "fixed", chỉ cần không âm
        },
        message: (props) => `Giá trị khuyến mãi không hợp lệ: ${props.value}`,
      },
    },
    NgayBD: { type: Date, required: true },
    NgayKT: { type: Date, required: true },
    TrangThai: { type: Number, default: 0 }, // Trạng thái (0: chưa bắt đầu, 1: Đang kích hoạt, 2: Đã kết thúc)
    sanpham: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);
const Promotion = mongoose.model("Promotion", PromotionSchema, "Promotion");

export default Promotion;
