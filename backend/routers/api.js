import { Router } from "express";
import DanhMucController from "../controllers/DanhMucController.js";

const apiRouter = Router();

apiRouter.get("/danhmucs", DanhMucController.apiList);
apiRouter.get("/danhmucs/:id", DanhMucController.apiDetail);
apiRouter.post("/danhmucs", DanhMucController.apiCreate);
apiRouter.put("/danhmucs/:id", DanhMucController.apiUpdate);
apiRouter.delete("/danhmucs/:id", DanhMucController.apiDelete);

export default apiRouter;
