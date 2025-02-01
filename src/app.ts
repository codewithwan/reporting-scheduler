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
import swaggerUi from "swagger-ui-express";

const app: Application = express();

// Trust proxy
app.set('trust proxy', true);

// Base API route
const apiBasePath = "/api/v1";

// Swagger setup
const swaggerDocs = setupSwagger();
app.use(`${apiBasePath}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.use(`${apiBasePath}`, router);
app.use(`${apiBasePath}/health`, healthRouter);
app.use(`${apiBasePath}/auth`, authRouter);
app.use(`${apiBasePath}/protected`, protectedRouter);
app.use(`${apiBasePath}/users`, userRouter);
app.use(`${apiBasePath}/schedules`, scheduleRouter);
app.use(`${apiBasePath}/customers`, customerRouter);
app.use(`${apiBasePath}/reschedules`, rescheduleRouter);
app.use(`${apiBasePath}/reports`, reportRouter);
app.use(`${apiBasePath}/services`, serviceRouter);
app.use(`${apiBasePath}/reminders`, reminderRouter);
app.use(`${apiBasePath}/products`, productRouter);

// Handle 404 - Route not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
