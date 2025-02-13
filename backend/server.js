import express from "express";
import ejs from "ejs";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/index.js";
import mongoose from "mongoose";

// Đọc các biến môi trường từ file .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

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
