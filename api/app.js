import express from "express";
import cookieParser from "cookie-parser";

// File imports
import ApplicationLevelError from "./middlewares/applicationError.middleware.js";
import logger from "./middlewares/logger.middleware.js";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logger (Placed BEFORE routes so all incoming requests are logged)
app.use((req, res, next) => {
  logger.http({
    message: "Incoming HTTP request",
    body:req.body,
    url: req.url,
    method: req.method,
    query: req.query,
    params: req.params,
  });
  next();
});

// Routes
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

//auth routes
app.use("/api/auth", authRouter);

// Application-level Error handler
app.use((err, req, res, next) => {
  logger.error({
    message: err.message || "Error while requesting",
    stack: err.stack,
    url: req.url,
    method: req.method,
    query: req.query,
    params: req.params,
  });

  if (err instanceof ApplicationLevelError) {
    return res.status(err.code).send(err.message);
  }
  res.status(500).send("Something went wrong!");
});

export default app;