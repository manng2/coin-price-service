import express, { Express, Request, Response } from 'express';
import { hotelRoute } from './routes';
import { initializeRedisClient } from './middlewares/redis.middleware';

const app: Express = express();
const port = process.env.PORT || 3000;

initializeRedisClient();

app.use('/hotel', hotelRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
