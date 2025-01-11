import mongoose from "mongoose";

// Schema Hóa đơn
const hoaDonSchema = new mongoose.Schema(
  {
    MaHD: {
      type: String,
      required: [true, "Mã hóa đơn là bắt buộc"],
    //   unique: true, // Đảm bảo Mã hóa đơn là duy nhất
      trim: true, // Loại bỏ khoảng trắng dư thừa
    },
    MaND: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nguoidung", // Tham chiếu đến bảng Người dùng
      required: true,
    },
    NgayLap: {
      type: Date,
      default: Date.now, // Mặc định là thời điểm hiện tại
    },
    NguoiNhan: {
      type: String,
      required: [true, "Tên người nhận là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên người nhận không được vượt quá 100 ký tự"],
    },
    SDT: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
      match: [/^\d{10}$/, "Số điện thoại phải gồm 10 chữ số"], // Định dạng số điện thoại
    },
    DiaChi: {
      type: String,
      required: [true, "Địa chỉ là bắt buộc"],
      trim: true,
      maxlength: [200, "Địa chỉ không được vượt quá 200 ký tự"],
    },
    PhuongThucTT: {
      type: String,
      enum: ["Tiền mặt", "Chuyển khoản", "Thẻ tín dụng"], // Các phương thức thanh toán được chấp nhận
      required: [true, "Phương thức thanh toán là bắt buộc"],
    },
    TongTien: {
      type: Number,
      required: [true, "Tổng tiền là bắt buộc"],
      min: [0, "Tổng tiền phải lớn hơn hoặc bằng 0"],
    },
    TrangThai: {
      type: String,
      enum: ["Chờ xử lý", "Đang giao", "Đã hoàn thành", "Đã hủy"], // Các trạng thái cho phép
      default: "Chờ xử lý", // Giá trị mặc định
    },
    NgayNhanHang: {
      type: Date,
      required: [true, "Ngày nhận hàng là bắt buộc"],
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model Hóa đơn
const HoaDon = mongoose.model("hoadon", hoaDonSchema);

export default HoaDon;
