import mongoose from "mongoose";
import ApplicationLevelError from "../middlewares/applicationError.middleware.js";
import User from "../models/users.model.js";

export default class UserRepository {
  createUser = async (username, email, password) => {
    try {
      // 1. Check if username OR email already exists
      const userExists = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (userExists) {
        throw new ApplicationLevelError("User with this email or username already exists!", 409);
      }

      // 2. Create the user
      const newUser = await User.create({ username, email, password });

      const userObj = newUser.toObject();
      delete userObj.password;

      return userObj;
    } catch (e) {
      // Pass-through existing ApplicationLevelError instances
      if (e instanceof ApplicationLevelError) {
        throw e;
      }

      // Catch Mongoose validation errors correctly
      if (e instanceof mongoose.Error.ValidationError) {
        const cleanMessage = Object.values(e.errors).map((e)=>e.message).join(", ")
        throw new ApplicationLevelError(cleanMessage, 400);
      }

      // Catch MongoDB duplicate key error
      if (e.code === 11000) {
        throw new ApplicationLevelError("User with this email or username already exists!", 409);
      }

      throw new ApplicationLevelError(`SignUp failed: ${e.message}`, 500);
    }
  };

  findUser = async (email, password) => {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new ApplicationLevelError("Invalid email or password!", 400);
      }

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        throw new ApplicationLevelError("Invalid email or password!", 400);
      }

      const userObj = user.toObject();
      delete userObj.password;

      return userObj;
    } catch (e) {
      if (e instanceof ApplicationLevelError) throw e;
      throw new ApplicationLevelError("Login failed!", 500);
    }
  };
}