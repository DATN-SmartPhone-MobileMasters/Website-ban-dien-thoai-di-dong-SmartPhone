import { Router } from "express";
import SanPhamController from "../controllers/SanPhamController.js";
import DanhMucController from "../controllers/DanhMucController.js";
import ThuongHieuController from "../controllers/ThuongHieuController.js";
import UsersController from "../controllers/UsersController.js";
import CommentController from "../controllers/CommentController.js";
import HoaDonController from "../controllers/HoaDonController.js";
import PromotionController from "../controllers/PromotionController.js";
import ChiTietHoaDonController from "../controllers/ChiTietHoaDonController.js";
// tạo router
const apiRouter = Router();

const DanhMucControl = new DanhMucController();
//api thực hiện các chức năng danh mục
apiRouter.get("/danhmucs", DanhMucControl.apiList); //lấy danh sách bản ghi
apiRouter.delete("/danhmucs/:id", DanhMucControl.apiDelete);
apiRouter.get("/danhmucs/:id", DanhMucControl.apiDetail);
apiRouter.post("/danhmucs", DanhMucControl.apiCreate);
apiRouter.put("/danhmucs/:id", DanhMucControl.apiUpdate);

const HoaDonControl = new HoaDonController();
// API thực hiện các chức năng hóa đơn (chỉ lấy danh sách, chi tiết và chỉnh sửa)
apiRouter.get("/hoadons", HoaDonControl.apiList); // Lấy danh sách bản ghi
apiRouter.get("/hoadons/:id", HoaDonControl.apiDetail); // Lấy chi tiết bản ghi
apiRouter.put("/hoadons/:id", HoaDonControl.apiEdit); // Cập nhật hóa đơn

const ChiTietHoaDonControl = new ChiTietHoaDonController();
// API cho chi tiết hóa đơn
apiRouter.get("/chitiethoadons", ChiTietHoaDonControl.apiList); // Lấy danh sách
apiRouter.get("/chitiethoadons/:id", ChiTietHoaDonControl.apiDetail); // Lấy chi tiết
apiRouter.post("/chitiethoadons", ChiTietHoaDonControl.apiCreate); // Thêm mới
apiRouter.put("/chitiethoadons/:id", ChiTietHoaDonControl.apiUpdate); // Cập nhật
apiRouter.delete("/chitiethoadons/:id", ChiTietHoaDonControl.apiDelete); // Xóa

const SanPhamControl = new SanPhamController();
//api thực hiện các chức năng sản phẩm
apiRouter.get("/sanphams", SanPhamControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/sanphams/:id", SanPhamControl.apiDetail); //lấy chi tiết
apiRouter.delete("/sanphams/:id", SanPhamControl.apiDelete);
apiRouter.post("/sanphams", SanPhamControl.apiCreate);
apiRouter.put("/sanphams/:id", SanPhamControl.apiUpdate);
const ThuongHieuControl = new ThuongHieuController();
// api thương hiệu
apiRouter.get("/thuonghieus", ThuongHieuControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/thuonghieus/:id", ThuongHieuControl.apiDetail); //lấy chi tiết
apiRouter.delete("/thuonghieus/:id", ThuongHieuControl.apiDelete);
apiRouter.post("/thuonghieus", ThuongHieuControl.apiCreate);
apiRouter.put("/thuonghieus/:id", ThuongHieuControl.apiUpdate);

const UsersControl = new UsersController();
// api thương hiệu
apiRouter.get("/users", UsersControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/users/:id", UsersControl.apiDetail); //lấy chi tiết
apiRouter.delete("/users/:id", UsersControl.apiDelete);
apiRouter.post("/users", UsersControl.apiCreate);
apiRouter.put("/users/:id", UsersControl.apiUpdate);

const CommentControl = new CommentController();
apiRouter.get("/comments", CommentControl.cmtList);
apiRouter.get("/comments/:id", CommentControl.cmtDetail);
apiRouter.delete("/comments/:id", CommentControl.cmtDelete);

const PromotionControl = new PromotionController();
apiRouter.get("/promotions", PromotionControl.getListPromotion);
apiRouter.get("/promotions/:id", PromotionControl.getDetailPromotion);
apiRouter.post("/promotions", PromotionControl.createPromotion);
apiRouter.delete("/promotions/:id", PromotionControl.deletePromotion);
apiRouter.put("/promotions/:id", PromotionControl.updatePromotion);
export default apiRouter;
