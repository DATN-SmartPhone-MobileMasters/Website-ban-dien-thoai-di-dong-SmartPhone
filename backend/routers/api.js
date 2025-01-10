import express from "express";
import {
  apiList,
  apiDetail,
  apiCreate,
  apiUpdate,
  apiDelete,
} from "../controllers/DanhMucController.js";

const router = express.Router();

router.get("/danhmucs", apiList);
router.get("/danhmucs/:id", apiDetail);
router.post("/danhmucs", apiCreate);
router.put("/danhmucs/:id", apiUpdate);
router.delete("/danhmucs/:id", apiDelete);

export default router;
