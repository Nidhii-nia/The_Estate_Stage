import AuthRepository from "../repository/auth.repository.js"
import jwt from "jsonwebtoken";

export default class AuthController {
  constructor() {
    this.User = new AuthRepository();
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
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        },
      );

      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          data: user,
        });
    } catch (e) {
      next(e);
    }
  };

  GoogleLogin = async (req, res, next) => {
    try {
      const { name, email, avatar } = req.body;
      console.log("Req.body:", req.body);
      

      const user = await this.User.pushGoogleLoginData(name, email, avatar);
      console.log("User Google:", user);

      const token = jwt.sign({ userId: user._id, username: user.username },process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({
          success: true,
          message: "Login successful",
          data: user,
        });
    } catch (e) {
      next(e);
    }
  };
}