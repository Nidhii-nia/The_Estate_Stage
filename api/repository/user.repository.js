import mongoose from "mongoose";
import ApplicationLevelError from "../middlewares/applicationError.middleware.js";
import User from "../models/users.model.js";

export default class UserRepository {
  createUser = async (username, email, password) => {
    try {
      // 1. Check if username OR email already exists
      const userExists = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (userExists) {
        throw new ApplicationLevelError(
          "User with this email or username already exists!",
          409,
        );
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
        const cleanMessage = Object.values(e.errors)
          .map((e) => e.message)
          .join(", ");
        throw new ApplicationLevelError(cleanMessage, 400);
      }

      // Catch MongoDB duplicate key error
      if (e.code === 11000) {
        throw new ApplicationLevelError(
          "User with this email or username already exists!",
          409,
        );
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

  pushGoogleLoginData = async (name, email, avatar) => {
    try {
      const userExists = await User.findOne({ email: email });
      console.log("User in DB already google repo:",userExists);
      
      if (userExists) {
        return userExists;
      }
      const password = Math.random().toString(36).slice(-8) + "@$Ab12";

      const username =
        name.split(" ").join("") + Math.random().toString(36).slice(-8);
      console.log("Google username:", username);

      const newUser = await User.create({
        username: username,
        email: email,
        password: password,
        avatar: avatar,
      });

      const userObj = newUser.toObject();
      delete userObj.password;

      console.log("UserObj google repo:", userObj);

      return userObj;
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        const errorMessage = Object.values(e.errors)
          .map((err) => err.message)
          .join(", ");
        throw new ApplicationLevelError(errorMessage, 400);
      }
      if (e.code === 11000) {
        throw new ApplicationLevelError(
          "User with this email or username already exists!",
          409,
        );
      }
      console.error("Google login failed:", e);
      throw new ApplicationLevelError("Login Failed", 500);
    }
  };

  updateAvatar = async(url) => {
    try{
      
    }catch(e){
      if(e instanceof mongoose.Error){
        throw new ApplicationLevelError(e.message,400);
      }
      throw new ApplicationLevelError("Something went wrong",500);
    }
  }
}
