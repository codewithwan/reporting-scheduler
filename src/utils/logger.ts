import { createLogger, format, transports } from "winston";

/**
 * Logger instance configured with Winston.
 * Logs messages to console and a file.
 */
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
  ],
});

export default logger;
 