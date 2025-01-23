import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export function setupSwagger(app: Application) {
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
          url: process.env.NODE_ENV === 'production' ? 'https://report.codewithwan.my.id/api/v1' : 'http://localhost:3000/api/v1',
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}
