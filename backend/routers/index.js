import { Router } from "express";
import apiRouter from "./api.js";
import cmtRouter from "./comment.js";

const router = Router();

router.use("/api", apiRouter); //router trả về api (dữ liệu dạng json)
router.use("/cmt", cmtRouter); // router comment
export default router;
