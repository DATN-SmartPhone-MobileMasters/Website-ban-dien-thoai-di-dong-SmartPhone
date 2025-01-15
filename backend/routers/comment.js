import { Router } from "express";
import CommentController from "../controllers/CommentController.js";

const cmtRouter = Router();
const controllers = new CommentController();

cmtRouter.get("/comments", controllers.cmtList);
cmtRouter.get("/comments/:id", controllers.cmtDetail);
// cmtRouter.put("/comments/:id", controllers.cmtUpdate);
cmtRouter.delete("/comments/:id", controllers.cmtDelete);
export default cmtRouter;
