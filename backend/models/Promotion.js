import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema(
  {
    MaKM: { type: Number, required: true, unique: true }, // Mã khuyến mãi
    TenKM: { type: String, required: true }, // Tên khuyến mãi
    LoaiKM: { type: String, required: true }, // Loại khuyến mãi
    GiaTriKM: { type: Number, required: true, min: 0 }, // Giá trị khuyến mãi
    NgayBD: { type: Date, required: true }, // Ngày bắt đầu
    NgayKT: { type: Date, required: true }, // Ngày kết thúc
    TrangThai: { type: Number, default: 0 }, // Trạng thái (0: chưa bắt đầu, 1: Đang kích hoạt, 2: Đã kết thúc)
    sanpham: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Sản phẩm liên quan
  },
  {
    timestamps: true, // Ngày tạo và ngày cập nhật
  }
);

// Tạo chỉ số cho các trường thường xuyên được truy vấn
PromotionSchema.index({ MaKM: 1 });
PromotionSchema.index({ TenKM: 1 });

const Promotion = mongoose.model("Promotion", PromotionSchema, "Promotion");

export default Promotion;
