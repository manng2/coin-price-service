import cors from 'cors';
import app from './server';
import { initMongoDBClient } from './utils/db-client.util';
import { initializeRedisClient } from './middlewares/redis.middleware';

app.use(cors());

const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://mannguyen:ECEvPdeEHCguvD3V@cluster0.ckbyr09.mongodb.net/?retryWrites=true&w=majority';

initializeRedisClient();

initMongoDBClient(uri).then(() => {
  app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
