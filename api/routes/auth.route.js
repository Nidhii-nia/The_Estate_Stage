import express from "express";
import AuthController from "../controllers/auth.controller.js";
import auth from "../middlewares/jwt.middleware.js";

const authRouter = express.Router();

const authController = new AuthController();

//signup route
authRouter.post("/signUp",authController.SignUp);

//login route
authRouter.post("/login",authController.Login);

//validate the persisted client session
authRouter.get("/session", auth, authController.Session);

//google route
authRouter.post("/google",authController.GoogleLogin);

//logout
authRouter.post("/logout",authController.Logout);

export default authRouter;