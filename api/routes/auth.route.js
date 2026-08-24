import express from "express";
import UserController from "../controllers/user.controller.js";

const authRouter = express.Router();

const userController = new UserController();

//signup route
authRouter.post("/signUp",userController.SignUp);

//login route
authRouter.post("/login",userController.Login);

//google route
authRouter.post("/google",userController.GoogleLogin);

export default authRouter;