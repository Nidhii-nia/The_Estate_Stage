import app from "./app.js";
import connectUsingMongoose from "./config/db.config.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectUsingMongoose();

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.log("Failed to start the server: ", e.message);
    process.exit(1);
  }
};

startServer();
