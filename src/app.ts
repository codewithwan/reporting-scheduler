import express, { Application, Request, Response, NextFunction, json, urlencoded } from "express";
import router from "./routes/indexRoutes";
import healthRouter from "./routes/healthRoutes";
import authRouter from "./routes/authRoutes";
import protectedRouter from "./routes/protectedRoutes";
import userRouter from "./routes/userRoutes";
import customerRouter from "./routes/customerRoutes";
import logger from "./utils/logger";
import scheduleRouter from "./routes/scheduleRoutes";
import rescheduleRouter from "./routes/rescheduleRoutes";
import reportRouter from "./routes/reportRoutes";
import serviceRouter from "./routes/serviceRoutes";

import { setupSwagger } from "./utils/swagger";
import cors from 'cors';
import reminderRouter from "./routes/reminderRoutes"; 
import "./jobs/reminderJob"; 
import productRouter from "./routes/productRoutes";

const app: Application = express();

// Trust proxy
app.set('trust proxy', true);

// Swagger setup
setupSwagger(app);

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_DOMAIN : `http://localhost:${process.env.CLIENT_LOCAL_PORT}`, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/v1", router);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/protected", protectedRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/schedules", scheduleRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/reschedules", rescheduleRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/reminders", reminderRouter); 
app.use("/api/v1/products", productRouter);

// Handle 404 - Route not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
