import express from "express";
import ejs from "ejs";
import cors from "cors";
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import router from "./routers/index.js";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: 'da4vekqeb',
  api_key: '718242253826553',
  api_secret: 'XqCYH_IXRodwJYqxfUU1wNrUrSQ',
  secure: true
});



// Đọc các biến môi trường từ file .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
}));
// Template engine
app.set("engine", "ejs");
app.set("views", "./views");

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI).then((result) => {
  // Router
  app.use("/", router);
  app.use(cors());
  // Start server
  app.listen(port, () => {
    console.log(`Server đang chạy ở port ${port}`);
  });
});
