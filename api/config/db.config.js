import mongoose from "mongoose";

const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_URI, {
      dbName: "ESTATE-DB",
    });
    console.log("Mongoose connected successfully!");
  } catch (e) {
    console.error("Failed to connect to DB:", e.message);
    process.exit(1);
  }
};

export default connectUsingMongoose;
