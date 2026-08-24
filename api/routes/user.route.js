import express from "express";
import auth from "../middlewares/jwt.middleware.js";
import UserController from "../controllers/user.controller.js";

const userRouter = express.Router();

const userController = new UserController();

userRouter.put('/update/:id',auth,userController.updateUser);

export default userRouter;