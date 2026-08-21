import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectUsingMongoose from "./config/db.config.js";
import ApplicationLevelError from "./middlewares/applicationError.middleware.js";

const PORT = process.env.PORT || 3000;


const startServer = async () => {
  try {
    await connectUsingMongoose();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (e) {
    throw new ApplicationLevelError(`Failed to start the server: ${e.message}`, 500);
  }
};

startServer();
