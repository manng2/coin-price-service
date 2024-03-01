import { initializeRedisClient } from './middlewares/redis.middleware';
import app from './server';

const port = process.env.PORT || 3000;

initializeRedisClient();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
