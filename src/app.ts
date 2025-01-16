import express, { Application } from "express";
import { json, urlencoded } from "express";
import router from "./routes";
import healthRouter from "./routes/health";

const app: Application = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api", router);
app.use("/api/health", healthRouter);

export default app;
