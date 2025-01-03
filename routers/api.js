import { Router } from "express";
import DanhmucController from "../controllers/DanhMucController.js";
import SanPhamController from "../controllers/SanPhamController.js";
import KhuyenMaiController from "../controllers/KhuyenMaiController.js";
import ThuongHieuController from "../controllers/ThuongHieuController.js";

const apiRouter = Router();
const danhmucControl = new DanhmucController();
const sanphamControl = new SanPhamController();
const khuyenmaiControl = new KhuyenMaiController();
const thuonghieuControl = new ThuongHieuController();

apiRouter.get("/danhmucs", danhmucControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/danhmucs/:id", danhmucControl.apiDetail); //lấy chi tiết
apiRouter.delete("/danhmucs/:id", danhmucControl.apiDelete);
apiRouter.post("/danhmucs", danhmucControl.apiCreate);
apiRouter.put("/danhmucs/:id", danhmucControl.apiUpdate);

apiRouter.get("/sanphams", sanphamControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/sanphams/:id", sanphamControl.apiDetail); //lấy chi tiết
apiRouter.delete("/sanphams/:id", sanphamControl.apiDelete);
apiRouter.post("/sanphams", sanphamControl.apiCreate);
apiRouter.put("/sanphams/:id", sanphamControl.apiUpdate);


apiRouter.get("/khuyenmais", khuyenmaiControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/khuyenmais/:id", khuyenmaiControl.apiDetail); //lấy chi tiết
apiRouter.delete("/khuyenmais/:id", khuyenmaiControl.apiDelete);
apiRouter.post("/khuyenmais", khuyenmaiControl.apiCreate);
apiRouter.put("/khuyenmais/:id", khuyenmaiControl.apiUpdate);


apiRouter.get("/thuonghieus", thuonghieuControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/thuonghieus/:id", thuonghieuControl.apiDetail); //lấy chi tiết
apiRouter.delete("/thuonghieus/:id", thuonghieuControl.apiDelete);
apiRouter.post("/thuonghieus", thuonghieuControl.apiCreate);
apiRouter.put("/thuonghieus/:id", thuonghieuControl.apiUpdate);

export default apiRouter;
