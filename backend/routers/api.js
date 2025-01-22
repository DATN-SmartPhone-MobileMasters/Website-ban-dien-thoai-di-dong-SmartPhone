import { Router } from "express";
import SanPhamController from "../controllers/SanPhamController.js";
import DanhMucController from "../controllers/DanhMucController.js";
// tạo router
const apiRouter = Router();
const DanhMucControl = new DanhMucController();
//api thực hiện các chức năng danh mục
apiRouter.get("/danhmucs", DanhMucControl.apiList); //lấy danh sách bản ghi
apiRouter.delete("/danhmucs/:id", DanhMucControl.apiDelete);
apiRouter.post("/danhmucs", DanhMucControl.apiCreate);
apiRouter.put("/danhmucs:id", DanhMucControl.apiUpdate);

const SanPhamControl = new SanPhamController();
//api thực hiện các chức năng sản phẩm
apiRouter.get("/sanphams", SanPhamControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/sanphams/:id", SanPhamControl.apiDetail); //lấy chi tiết
apiRouter.delete("/sanphams/:id", SanPhamControl.apiDelete);
apiRouter.post("/sanphams", SanPhamControl.apiCreate);
apiRouter.put("/sanphams/:id", SanPhamControl.apiUpdate);
export default apiRouter;
