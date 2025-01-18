import { Router } from "express";
import ThuongHieuController from "../controller/ThuongHieuController.js";
// tạo router
const thRouter = Router();

const ThuongHieuControl = new ThuongHieuController();
thRouter.get("/thuonghieus", ThuongHieuControl.apiList); //lấy danh sách bản ghi
thRouter.get("/thuonghieus/:id", ThuongHieuControl.apiDetail); //lấy chi tiết
thRouter.delete("/thuonghieus/:id", ThuongHieuControl.apiDelete);
thRouter.post("/thuonghieus", ThuongHieuControl.apiCreate);
thRouter.put("/thuonghieus/:id", ThuongHieuControl.apiUpdate);

export default thRouter;
