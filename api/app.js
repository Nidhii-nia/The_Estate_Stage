import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//file imports
import ApplicationLevelError from "./middlewares/applicationError.middleware.js";
import logger from "./middlewares/logger.middleware.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/test",(req,res)=>{
  res.send("Hello World!");
})

//request logger
app.use((req, res, next) => {
  logger.http("Incoming HTTP request: ", {
    url: req.url,
    method: req.method,
    query: req.query,
    params: req.params,
  });
  next();
});

//USER ROUTES
app.use("/api/user", userRouter);


//Appliaction level Error handler
app.use((err, req, res, next) => {
  logger.error("Error while requesting: ", {
    message: err.message,
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
