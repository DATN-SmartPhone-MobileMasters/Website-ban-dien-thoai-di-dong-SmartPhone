import { Router } from "express";
import ThuongHieuController from "../controllers/ThuongHieuController.js";
// tạo router
const apiRouter = Router();

// Router thuong hieu
const ThuongHieuControl = new ThuongHieuController();
apiRouter.get("/thuonghieus", ThuongHieuControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/thuonghieus/:id", ThuongHieuControl.apiDetail); //lấy chi tiết
apiRouter.delete("/thuonghieus/:id", ThuongHieuControl.apiDelete);
apiRouter.post("/thuonghieus", ThuongHieuControl.apiCreate);
apiRouter.put("/thuonghieus/:id", ThuongHieuControl.apiUpdate);
export default apiRouter;
