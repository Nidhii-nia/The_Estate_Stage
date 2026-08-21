import express from "express";
import UserController from "../controllers/user.controller.js";

const userRouter = express.Router();

const userController = new UserController();

//signup route
userRouter.post("/signUp",userController.SignUp);

//login route
userRouter.post("/login",userController.Login);

export default userRouter;