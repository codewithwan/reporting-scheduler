import express, { Application } from "express";
import { json, urlencoded } from "express";
import router from "./routes";

const app: Application = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api", router);

export default app;
