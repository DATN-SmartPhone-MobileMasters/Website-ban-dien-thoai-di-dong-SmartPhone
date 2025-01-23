import { Router } from "express";
import SanPhamController from "../controllers/SanPhamController.js";
import DanhMucController from "../controllers/DanhMucController.js";
import ThuongHieuController from "../controllers/ThuongHieuController.js";
import UsersController from "../controllers/UsersController.js";
// tạo router
const apiRouter = Router();
const DanhMucControl = new DanhMucController();
//api thực hiện các chức năng danh mục
apiRouter.get("/danhmucs", DanhMucControl.apiList); //lấy danh sách bản ghi
apiRouter.delete("/danhmucs/:id", DanhMucControl.apiDelete);
apiRouter.get("/danhmucs/:id", DanhMucControl.apiDetail);
apiRouter.post("/danhmucs", DanhMucControl.apiCreate);
apiRouter.put("/danhmucs/:id", DanhMucControl.apiUpdate);

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

const usersRouter = new UsersController();
//api users
usersRouter.get("/users", UsersController.userList);
usersRouter.get("/users/:id", UsersController.userDetail);
usersRouter.delete("/users/:id", UsersController.userDelete);
usersRouter.post("/users", UsersController.userCreate);
usersRouter.put("/users/:id", UsersController.userUpdate);

export default apiRouter;
