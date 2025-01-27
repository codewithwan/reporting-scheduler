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
import { setupSwagger } from "./utils/swagger";
import cors from 'cors';
import reminderRouter from "./routes/reminderRoutes"; 

const app: Application = express();

// Swagger setup
setupSwagger(app);

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', 
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
app.use("/api/v1/schedule", scheduleRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/reschedules", rescheduleRouter);
app.use("/api/v1/reminders", reminderRouter); 

// Handle 404 - Route not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
