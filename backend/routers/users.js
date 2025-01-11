import { Router } from "express";
import UsersController from "../controllers/UsersController.js";

const usersRouter = Router();

usersRouter.get("/users", UsersController.apiList);
usersRouter.get("/users/:id", UsersController.apiDetail);
usersRouter.delete("/users/:id", UsersController.apiDelete);
usersRouter.post("/users", UsersController.apiCreate);
usersRouter.put("/users/:id", UsersController.apiUpdate);

export default usersRouter;

