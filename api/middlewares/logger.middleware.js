import winston from "winston";
import path from "path";

const { createLogger, format, transports } = winston;

const ignoreErrors = format((info)=>{
    if(info.level === "error"){
        return false;
    }
    return info;
})

const logger = createLogger({
  level: "http",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: path.join("logs", "app.log"),
      level: "http",
      format: format.combine(ignoreErrors(), format.timestamp(), format.json())
    }),
  ],
});

logger.add(
  new transports.Console({
    level: "error",
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
  })
);


export default logger;
