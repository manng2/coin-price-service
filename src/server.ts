import express, { Express, Request, Response } from 'express';
import { priceRoute } from './routes';
import bodyParser from 'body-parser';
import cors from 'cors';

const app: Express = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/price', priceRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

export default app;
