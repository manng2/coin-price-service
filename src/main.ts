import { initializeRedisClient } from './middlewares/redis.middleware';
import app from './server';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

app.use(cors());

const port = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Accommodation data fusion API with Swagger',
      version: '0.1.0',
      description: 'A simple web server for procuring and merging hotel data from multiple suppliers',
      contact: {
        name: 'Nguyen Ngoc Man (Mike)',
        email: 'nnman.vn@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://13.250.30.193:3000',
      },
    ],
  },
  apis: ['./src/routes/*.route.ts'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

initializeRedisClient();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
