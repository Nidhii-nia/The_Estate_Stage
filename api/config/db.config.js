import mongoose from "mongoose";
import ApplicationLevelError from "../middlewares/applicationError.middleware.js";

const connectUsingMongoose = async () => {
  try {    
    await mongoose.connect(process.env.DB_CONNECTION_URI, {
      dbName: "ESTATE-DB",
    });
    console.log("Mongoose connected successfully!");
  } catch (e) {
    throw new ApplicationLevelError(`Failed to connect to DB: ${e.message}`,500);
  }
};

export default connectUsingMongoose;
