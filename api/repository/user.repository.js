import mongoose, { isValidObjectId } from "mongoose";
import ApplicationLevelError from "../middlewares/applicationError.middleware.js";
import User from "../models/users.model.js";

export default class UserRepository {
  modifyUser = async (id, username, email, password, avatar) => {
    try {
      if (!isValidObjectId(id)) {
        throw new ApplicationLevelError("Invalid user ID", 400);
      }
      console.log("Id update user repo:", id);
      
      const user = await User.findById(id);

      if (!user) {
        throw new ApplicationLevelError("User not found!", 404);
      }

      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = password;
      if (avatar) user.avatar = avatar;

      const updatedUser = await user.save();

      const modifiedUserObj = updatedUser.toObject();

      delete modifiedUserObj.password;

      return modifiedUserObj;
    } catch (e) {
      if (e instanceof ApplicationLevelError) {
        throw e;
      }

      if (e instanceof mongoose.Error.ValidationError) {
        const err = Object.values(e.errors)
          .map((err) => err.message)
          .join(", ");

        throw new ApplicationLevelError(err, 400);
      }
      console.log("Something went wrong update user repo:",e.message);
      
      throw new ApplicationLevelError(`Something went wrong `, 500);
    }
  };
}
