import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// File imports
import ApplicationLevelError from "./middlewares/applicationError.middleware.js";
import logger from "./middlewares/logger.middleware.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.join(__dirname, "..", "client", "dist");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(clientDistPath));

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

// ROUTES
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

//auth routes
app.use("/api/auth", authRouter);

//user routes
app.use("/api/user", userRouter);

//listing routes
app.use("/api/listing", listingRouter);

// Let the client-side router handle non-API routes in production.
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

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
  next();
});

app.use((req,res)=>{
  res.status(404).send("No such route exists!");
})

export default app;