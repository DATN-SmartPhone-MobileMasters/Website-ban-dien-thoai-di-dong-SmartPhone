import { Router } from "express";
import apiRouter from "./api.js";
import routePromotion from "./promotion.js";

const router = Router();

router.use("/api", apiRouter); //router trả về api (dữ liệu dạng json)

import cmtRouter from "./comment.js";



router.use("/api", apiRouter); //router trả về api (dữ liệu dạng json)
router.use("/cmt", cmtRouter); // router comment
router.use("/api/v1/promotion", routePromotion);


router.use('/api', apiRouter); //router trả về api (dữ liệu dạng json)

export default router;
