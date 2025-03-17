import mongoose from "mongoose";

const DanhGiaSchema = new mongoose.Schema({
    Ten: {type: String},
    NoiDung: {type: String},
    DanhGia: {type: String},
    created_at: { type: Date, default: Date.now },
});

const danhgia = mongoose.model("DanhGia", DanhGiaSchema);
export default danhgia;