import express, { Application } from "express";
import { json, urlencoded } from "express";
import router from "./routes/indexRoutes";
import healthRouter from "./routes/healthRoutes";
import authRouter from "./routes/authRoutes";
import protectedRouter from "./routes/protectedRoutes";
import userRouter from "./routes/userRoutes";
import logger from "./utils/logger";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app: Application = express();

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Reporting Scheduler API",
      version: "1.0.0",
      description: "API documentation for the Reporting Scheduler",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
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

export default app;
