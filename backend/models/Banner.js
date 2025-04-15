import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
    Banner1: {type: String},
    Banner2: {type: String},
    Banner3: {type: String},
    Banner4: {type: String},
    Banner5: {type: String},
    Banner6: {type: String},
    Banner7: {type: String},
    Banner8: {type: String},
    Banner9: {type: String},
    Banner10: {type: String},
});

export default mongoose.model("Banner", BannerSchema);