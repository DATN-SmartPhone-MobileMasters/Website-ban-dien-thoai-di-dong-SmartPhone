import { Router } from "express";
import DanhMucController from "../controllers/DanhMucController.js";

const apiRouter = Router();

apiRouter.get("/danhmucs", DanhMucController.apiList);
apiRouter.get("/danhmucs/:id", DanhMucController.apiDetail);
apiRouter.post("/danhmucs", DanhMucController.apiCreate);
apiRouter.put("/danhmucs/:id", DanhMucController.apiUpdate);
apiRouter.delete("/danhmucs/:id", DanhMucController.apiDelete);

import SanPhamController from "../controllers/SanPhamController.js";

const SanPhamControl = new SanPhamController();
//api thực hiện các chức năng sản phẩm
apiRouter.get("/sanphams", SanPhamControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/sanphams/:id", SanPhamControl.apiDetail); //lấy chi tiết
apiRouter.delete("/sanphams/:id", SanPhamControl.apiDelete);
apiRouter.post("/sanphams", SanPhamControl.apiCreate);
apiRouter.put("/sanphams/:id", SanPhamControl.apiUpdate);

import ThuongHieuController from "../controllers/ThuongHieuController.js";

const ThuongHieuControl = new ThuongHieuController();
apiRouter.get("/thuonghieus", ThuongHieuControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/thuonghieus/:id", ThuongHieuControl.apiDetail); //lấy chi tiết
apiRouter.delete("/thuonghieus/:id", ThuongHieuControl.apiDelete);
apiRouter.post("/thuonghieus", ThuongHieuControl.apiCreate);
apiRouter.put("/thuonghieus/:id", ThuongHieuControl.apiUpdate);
import HoaDonController from "../controllers/HoaDonController.js";

// Tạo router


// API thực hiện các chức năng hóa đơn
apiRouter.get("/hoadons", HoaDonController.apiList); // Lấy danh sách bản ghi
apiRouter.get("/hoadons/:id", HoaDonController.apiDetail); // Lấy chi tiết hóa đơn
apiRouter.delete("/hoadons/:id", HoaDonController.apiDelete); // Xóa hóa đơn
apiRouter.put("/hoadons/:id", HoaDonController.apiUpdate_hoadon); // Cập nhật hóa đơn

export default apiRouter;
