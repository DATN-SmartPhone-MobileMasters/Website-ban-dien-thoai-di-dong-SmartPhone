import { Router } from "express";
import HoaDonController from "../controllers/HoaDonController.js";

// Tạo router
const apiRouter = Router();

// API thực hiện các chức năng hóa đơn
apiRouter.get("/hoadons", HoaDonController.apiList); // Lấy danh sách bản ghi
apiRouter.get("/hoadons/:id", HoaDonController.apiDetail); // Lấy chi tiết hóa đơn
apiRouter.delete("/hoadons/:id", HoaDonController.apiDelete); // Xóa hóa đơn
apiRouter.put("/hoadons/:id", HoaDonController.apiUpdate_hoadon); // Cập nhật hóa đơn

export default apiRouter;
