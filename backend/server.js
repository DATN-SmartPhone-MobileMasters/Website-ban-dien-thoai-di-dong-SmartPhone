//khởi tạo node server
import express from "express"; //express dùng để khởi tạo node server
import ejs from "ejs"; //template engine để xây dựng giao diện
import mongoose from "mongoose"; //kết nối CSDL MongoDB
import router from "./routers/index.js";
import cors from "cors";

const app = new express();
const port = 5000; //khai báo cổng sẽ chạy
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

//cấu hình template engine
app.set("engine", "ejs");
app.set("views", "./views"); //khai báo thư mục chứa file giao diện
mongoose
  .connect("mongodb://localhost:27017/DATN") //kết nối vs CSDL
  .then((result) => {
    //nếu kết nối vs CSDL thành công
    app.use("/", router); //gọi vào router tổng (index.js)
    app.listen(port, () => {
      console.log(`Server đang chạy ở port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
