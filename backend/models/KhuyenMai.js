import mongoose from "mongoose"; //kết nối với CSDL


const khuyenMaiSchema = new mongoose.Schema({
  TenKM: {
    type: String,
    required: true
  },
  LoaiKM: {
    type: String
  },
  GiaTriKM: {
    type: Number
  },
  NgayBD: {
    type: Date
  },
  NgayKT: {
    type: Date
  },
  TrangThai: {
    type: Number
  }
});

const khuyenmai = mongoose.model('khuyenmai', khuyenMaiSchema);
export default khuyenmai;
