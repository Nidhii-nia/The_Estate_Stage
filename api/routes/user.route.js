import express from "express";
import auth from "../middlewares/jwt.middleware.js";
import UserController from "../controllers/user.controller.js";

const userRouter = express.Router();

const userController = new UserController();

//update user profile
userRouter.put("/update/:id", auth, userController.updateUser);

//delete user account
userRouter.delete("/delete/:id", auth, userController.deleteUser);

//logout user

export default userRouter;
