import { Router } from "express";
import SanPhamController from "../controllers/SanPhamController.js";
import ThuongHieuController from "../controllers/ThuongHieuController.js";
import DanhmucController from "../controllers/DanhMucController.js";
// tạo router
const apiRouter = Router();

const danhmucControl = new DanhmucController();
apiRouter.get("/danhmucs", danhmucControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/danhmucs/:id", danhmucControl.apiDetail); //lấy chi tiết
apiRouter.delete("/danhmucs/:id", danhmucControl.apiDelete);
apiRouter.post("/danhmucs", danhmucControl.apiCreate);
apiRouter.put("/danhmucs/:id", danhmucControl.apiUpdate);

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
