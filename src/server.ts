import express, { Express, Request, Response } from 'express';
import { hotelRoute } from './routes';

const app: Express = express();

app.use('/hotel', hotelRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

export default app;
