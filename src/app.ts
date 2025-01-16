import express, { Application } from "express";
import { json, urlencoded } from "express";
import router from "./routes/indexRoutes";
import healthRouter from "./routes/healthRoutes";
import authRouter from "./routes/authRoutes";
import protectedRouter from "./routes/protectedRoutes";
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
