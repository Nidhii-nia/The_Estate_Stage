import UserRepository from "../repository/user.repository.js";
import jwt from "jsonwebtoken";

export default class UserController {
  constructor() {
    this.User = new UserRepository();
  }

  SignUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const userInfo = await this.User.createUser(username, email, password);

      return res.status(201).json({
        success: true,
        message: "Sign up successful",
        data: userInfo,
      });
    } catch (e) {
      next(e);
    }
  };

  Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.User.findUser(email, password);

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
        data: user,
      });
    } catch (e) {
      next(e);
    }
  };
}