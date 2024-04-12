import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIAO_BACKEND API',
      version: '1.0.0',
      description: 'API documentation for Sialo.',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: [`${__dirname}/*.ts`], // Path to the API routes
};
export const swaggerSpec = swaggerJSDoc(options);

export const swagger = function (app: express.Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
