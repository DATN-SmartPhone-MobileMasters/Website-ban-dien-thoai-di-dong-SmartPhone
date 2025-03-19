import { Router } from "express";
import SanPhamController from "../controllers/SanPhamController.js";
import DanhMucController from "../controllers/DanhMucController.js";
import ThuongHieuController from "../controllers/ThuongHieuController.js";
import UsersController from "../controllers/UsersController.js";
import CommentController from "../controllers/CommentController.js";
import HoaDonController from "../controllers/HoaDonController.js";
import PromotionController from "../controllers/PromotionController.js";
import DanhGiaController from "../controllers/DanhGiaController.js";
// tạo router
const apiRouter = Router();

// API đánh giá cửa hàng
const DanhGiaControl = new DanhGiaController();
apiRouter.get("/danhgias", DanhGiaControl.apiList);
apiRouter.delete("/danhgias/:id", DanhGiaControl.apiDelete);
apiRouter.post("/danhgias", DanhGiaControl.apiCreate);

const DanhMucControl = new DanhMucController();
//api thực hiện các chức năng danh mục
apiRouter.get("/danhmucs", DanhMucControl.apiList); //lấy danh sách bản ghi
apiRouter.delete("/danhmucs/:id", DanhMucControl.apiDelete);
apiRouter.get("/danhmucs/:id", DanhMucControl.apiDetail);
apiRouter.post("/danhmucs", DanhMucControl.apiCreate);
apiRouter.put("/danhmucs/:id", DanhMucControl.apiUpdate);

const HoaDonControl = new HoaDonController();
// API thực hiện các chức năng hóa đơn (chỉ lấy danh sách, chi tiết và chỉnh sửa)
apiRouter.post("/hoadons", HoaDonControl.apiCreate);
apiRouter.get("/hoadons", HoaDonControl.apiList); // Lấy danh sách bản ghi
apiRouter.get("/hoadons/:id", HoaDonControl.apiDetail); // Lấy chi tiết bản ghi
apiRouter.put("/hoadons/:id", HoaDonControl.apiEdit);
apiRouter.get("/hoadons/user/:userId", HoaDonControl.apiListByUserId); // Cập nhật hóa đơn
apiRouter.delete("/hoadons/:id", HoaDonControl.apiDelete);

const sanPhamControl = new SanPhamController();
// API thực hiện các chức năng sản phẩm
apiRouter.get("/sanphams", sanPhamControl.apiList); // Lấy danh sách sản phẩm
apiRouter.delete("/sanphams/:id", sanPhamControl.apiDelete);
apiRouter.get("/sanphams/:id", sanPhamControl.apiDetail);
apiRouter.post("/sanphams", sanPhamControl.apiCreate);
apiRouter.put("/sanphams/:id", sanPhamControl.apiUpdate);
apiRouter.post("/upload", sanPhamControl.apiUpload);

const ThuongHieuControl = new ThuongHieuController();
// api thương hiệu
apiRouter.get("/thuonghieus", ThuongHieuControl.apiList); //lấy danh sách bản ghi
apiRouter.get("/thuonghieus/:id", ThuongHieuControl.apiDetail); //lấy chi tiết
apiRouter.delete("/thuonghieus/:id", ThuongHieuControl.apiDelete);
apiRouter.post("/thuonghieus", ThuongHieuControl.apiCreate);
apiRouter.put("/thuonghieus/:id", ThuongHieuControl.apiUpdate);

const UsersControl = new UsersController();
apiRouter.get("/users", UsersControl.apiList);
apiRouter.get("/users/:id", UsersControl.apiDetail);
apiRouter.delete("/users/:id", UsersControl.apiDelete);
apiRouter.post("/users/signup", UsersControl.apiSignUp);
apiRouter.post("/users/login", UsersControl.apiLogin);
apiRouter.put("/users/:id", UsersControl.apiUpdate);
apiRouter.put("/users/update-password/:id", UsersControl.apiUpdatePassword);
apiRouter.post("/users/forgot-password", UsersControl.apiForgotPassword);
apiRouter.post("/users/reset-password", UsersControl.apiResetPassword);

const CommentControl = new CommentController();
apiRouter.get("/comments", CommentControl.cmtList);
apiRouter.get("/comments/:id", CommentControl.cmtDetail);
apiRouter.delete("/comments/:id", CommentControl.cmtDelete);
apiRouter.post("/comments", CommentControl.cmtCreate);

const PromotionControl = new PromotionController();
apiRouter.get("/promotions", PromotionControl.getListPromotion);
apiRouter.get("/promotions/:id", PromotionControl.getDetailPromotion);
apiRouter.post("/promotions", PromotionControl.createPromotion);
apiRouter.delete("/promotions/:id", PromotionControl.deletePromotion);
apiRouter.put("/promotions/:id", PromotionControl.updatePromotion);
export default apiRouter;
