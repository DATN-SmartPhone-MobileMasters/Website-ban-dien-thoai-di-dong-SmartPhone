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
    enum: ['Chờ xử lý', ' Đang Giao', ' Hoàn thành',' Huỷ Đơn'],
    default: 'Chờ xử lý'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HoaDon = mongoose.model('HoaDon', HoaDonSchema);
export default HoaDon;