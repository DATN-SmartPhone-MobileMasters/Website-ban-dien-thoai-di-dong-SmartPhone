import { Router } from "express";
import thRouter from "./thuonghieu.js";
const router = Router();
router.use("/", thRouter);
export default router;
