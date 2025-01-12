import { Router } from "express";
import UsersController from "../controllers/UsersController.js";

const usersRouter = Router();

usersRouter.get("/users", UsersController.userList);
usersRouter.get("/users/:id", UsersController.userDetail);
usersRouter.delete("/users/:id", UsersController.userDelete);
usersRouter.post("/users", UsersController.userCreate);
usersRouter.put("/users/:id", UsersController.userUpdate);

export default usersRouter;

