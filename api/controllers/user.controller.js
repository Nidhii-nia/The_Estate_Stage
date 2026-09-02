import ApplicationLevelError from "../middlewares/applicationError.middleware.js";
import UserRepository from "../repository/user.repository.js";

export default class UserController {
  constructor() {
    this.User = new UserRepository();
  }

  updateUser = async (req, res, next) => {
    try {
      console.log("Req user update user: ", req.user.userId);
      console.log("Req params id update user: ", req.params.id);

      if (String(req.user.userId) !== String(req.params.id)) {
        throw new ApplicationLevelError(
          "Forbidden: Cannot delete this account!",
          403,
        );
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

  deleteUser = async (req, res, next) => {
    try {
      console.log("Delete user controller req.user.userId:", req.user.userId);
      console.log("Delete user controller req.params.id:", req.params.id);

      if (req.user.userId !== req.params.id) {
        throw new ApplicationLevelError(
          "Forbidden: Cannot delete this account!",
          403,
        );
      }

      const response = await this.User.removeUser(req.params.id);

      return res.status(200).json({
        success: true,
        message: "User account deleted successfully!",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };
}
