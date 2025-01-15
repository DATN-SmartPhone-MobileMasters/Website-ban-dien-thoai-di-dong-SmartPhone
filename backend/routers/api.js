import express from "express";
import DanhMucController from "../controllers/DanhMucController.js";

const router = express.Router();

router.get("/danhmucs", DanhMucController.apiList);
router.get("/danhmucs/:id", DanhMucController.apiDetail);
router.post("/danhmucs", DanhMucController.apiCreate);
router.put("/danhmucs/:id", DanhMucController.apiUpdate);
router.delete("/danhmucs/:id", DanhMucController.apiDelete);

export default router;
