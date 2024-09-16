import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const SwaggerOption = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'API Documentation',
          version: '1.0.0',
          description: 'API Documentation for your application'
        },
        servers: [
          {
            url: 'http://localhost:3000', 
            description: 'Local server'
          }
        ]
      },
      apis: ['../routes/*,ts'], 
    };
    
    const swaggerDocs = swaggerJSDoc(SwaggerOption);
    
    export const setupSwagger = (app: Express) => {
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}