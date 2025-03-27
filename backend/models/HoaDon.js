// HoaDon.js
import mongoose from 'mongoose';

const HoaDonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    memory: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  additionalDiscount: { type: Number, default: 0 },
  shippingInfo: {
    name: String,
    phone: String,
    address: String
  },
  paymentStatus: {
    type: String,
    enum: ['Chờ xử lý', 'Đã Xác Nhận','Đang Giao', 'Hoàn thành','Huỷ Đơn'],
    default: 'Chờ xử lý'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'VNPay'],
    default: 'COD'
  },
  vnp_TransactionNo: String, // Store VNPay transaction number
  vnp_ResponseCode: String, // Store VNPay response code
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HoaDon = mongoose.model('HoaDon', HoaDonSchema);
export default HoaDon;
