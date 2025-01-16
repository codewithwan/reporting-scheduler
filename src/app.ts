import express, { Application } from "express";
import { json, urlencoded } from "express";
import router from "./routes";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import protectedRouter from "./routes/protected";
import logger from "./utils/logger";

const app: Application = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", router);
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);

export default app;
