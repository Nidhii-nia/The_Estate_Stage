import express from "express";
import AuthController from "../controllers/auth.controller.js";

const authRouter = express.Router();

const authController = new AuthController();

//signup route
authRouter.post("/signUp",authController.SignUp);

//login route
authRouter.post("/login",authController.Login);

//google route
authRouter.post("/google",authController.GoogleLogin);

export default authRouter;