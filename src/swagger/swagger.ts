import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { OAS3Definition } from 'swagger-jsdoc';

import * as auth_docs from './auth.docs';
import * as user_docs from './user.docs';
import * as post_docs from './post.docs';
import * as story_docs from './story.docs';

export const swaggerConfig: OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'SIAO_BACKEND API',
    version: '1.0.0',
    description: 'API documentation for Sialo.',
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local development server',
    },
  ],
  paths: {
    ...auth_docs.docs,
    ...user_docs.docs,
    ...post_docs.docs,
    ...story_docs.docs,
  },
  components: {
    ...auth_docs.schema,
    schemas: {
      ...user_docs.schema,
      ...post_docs.schema,
      ...story_docs.schema,
    },
  },
};

const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css';

export const swagger = function (app: express.Application) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig, {
    customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
  }));
};
