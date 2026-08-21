import mongoose from "mongoose";
import bcrypt from "bcrypt";
import ApplicationLevelError from "../middlewares/applicationError.middleware.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        "Please enter a valid email!",
      ],
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "The password must contain atleast one upperCase, one lowerCase, one special character, one number and must be of 8 characters!",
      ],
      required: true,
      select:false,
      
    },
  },
  { timestamps: true },
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (e) {
    throw new ApplicationLevelError(e.message,500);
  }
});

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password);
}

const User = mongoose.model("User", userSchema);

export default User;
