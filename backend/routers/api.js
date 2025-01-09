import { Router } from "express";
import SanPhamController from "../controllers/SanPhamController";
// tạo router
const apiRouter = Router();

//api thực hiện các chức năng sản phẩm
apiRouter.get("/sanphams", SanPhamController.apiList); //lấy danh sách bản ghi
apiRouter.get("/sanphams/:id", SanPhamController.apiDetail); //lấy chi tiết
apiRouter.delete("/sanphams/:id", SanPhamController.apiDelete);
apiRouter.post("/sanphams", SanPhamController.apiCreate);
apiRouter.put("/sanphams/:id", SanPhamController.apiUpdate);
export default apiRouter;
