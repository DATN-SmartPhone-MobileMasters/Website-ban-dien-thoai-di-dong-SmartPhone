import { Router } from "express";
import SanPhamController from "../controllers/SanPhamController.js";
import ThuongHieuController from "../controllers/ThuongHieuController.js";
// tạo router
const apiRouter = Router();
const SanPhamControl = new SanPhamController();
//api thực hiện các chức năng sản phẩm
apiRouter.get("/sanphams", SanPhamControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/sanphams/:id", SanPhamControl.apiDetail); //lấy chi tiết
apiRouter.delete("/sanphams/:id", SanPhamControl.apiDelete);
apiRouter.post("/sanphams", SanPhamControl.apiCreate);
apiRouter.put("/sanphams/:id", SanPhamControl.apiUpdate);

// Router thuong hieu
const ThuongHieuControl = new ThuongHieuController();
apiRouter.get("/thuonghieus", ThuongHieuControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/thuonghieus/:id", ThuongHieuControl.apiDetail); //lấy chi tiết
apiRouter.delete("/thuonghieus/:id", ThuongHieuControl.apiDelete);
apiRouter.post("/thuonghieus", ThuongHieuControl.apiCreate);
apiRouter.put("/thuonghieus/:id", ThuongHieuControl.apiUpdate);
export default apiRouter;
