import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export function setupSwagger() {
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
          url: process.env.NODE_ENV === 'production' ? process.env.SERVER_DOMAIN : 'http://localhost:3000/api/v1',
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };

  return swaggerJsdoc(swaggerOptions);
}
