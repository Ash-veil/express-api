import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const router = express.Router();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [], 
      },
    ],
  },
  apis: ["./route/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
