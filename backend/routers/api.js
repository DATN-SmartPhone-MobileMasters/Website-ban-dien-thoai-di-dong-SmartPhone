import { Router } from "express";
import { apiList, apiDetail, apiDelete, apiUpdate_hoadon } from "../controllers/HoaDonController.js";
// tạo router
const apiRouter = Router();

//api thực hiện các chức năng sản phẩm
apiRouter.get("/hoadons", apiList); //lấy danh sách bản ghi
apiRouter.get("/hoadons/:id", apiDetail); //lấy chi tiết
apiRouter.delete("/hoadons/:id", apiDelete);
apiRouter.put("/hoadons/:id", apiUpdate_hoadon);
export default apiRouter;
