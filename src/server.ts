import express, { Express, Request, Response } from 'express';
import { priceRoute } from './routes';

const app: Express = express();

app.use('/price', priceRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

export default app;
