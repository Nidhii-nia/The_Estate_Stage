import ApplicationLevelError from "../middlewares/applicationError.middleware.js";
import UserRepository from "../repository/user.repository.js";

export default class UserController {
  constructor() {
    this.User = new UserRepository();
  }

  updateUser = async (req, res, next) => {
    try {
      console.log("Req user update user: ",req.user.userId);
      console.log("Req params id update user: ",req.params.id);
      
      if (String(req.user.userId) !== String(req.params.id)) {
        throw new ApplicationLevelError("Unauthorized: Cannot modify this account!", 401);
      }

      const { id } = req.params;
      const { username, email, password, avatar } = req.body;
      const user = await this.User.modifyUser(
        id,
        username,
        email,
        password,
        avatar,
      );

      return res.status(200).json({
        success: true,
        message: "user info updated successfully!",
        data: user,
      });
    } catch (e) {
      next(e);
    }
  };
}
