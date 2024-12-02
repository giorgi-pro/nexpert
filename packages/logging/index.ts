import winston from "winston";

const logger = winston.createLogger({
  transports: [],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  })
);

export default logger;
