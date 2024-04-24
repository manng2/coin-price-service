import cors from 'cors';
import app from './server';
import { chartLogs, initMongoDBClient } from './utils/db-client.util';
import { generateD1ChartData, generateH1ChartData, generateH4ChartData } from './utils';
import fs from 'fs';

app.use(cors());

const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://mannguyen:ECEvPdeEHCguvD3V@cluster0.ckbyr09.mongodb.net/?retryWrites=true&w=majority';
const oneHour = 60 * 60 * 1000;

// initializeRedisClient();

initMongoDBClient(uri).then(() => {
  app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});

// Generate H1 Chart Data
setInterval(async () => {
  console.log('Go here');
  const data = await chartLogs.find({}).toArray();
  const filePath = 'src/public/h1.json';

  const ans = generateH1ChartData(data).data;

  fs.writeFile(filePath, JSON.stringify(ans), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('H1 Chart Data has been written to the file successfully.');
    }
  });
}, oneHour);

// Generate H4 Chart Data
setInterval(async () => {
  console.log('Go here');
  const data = await chartLogs.find({}).toArray();
  const filePath = 'src/public/h4.json';

  const ans = generateH4ChartData(data).data;

  fs.writeFile(filePath, JSON.stringify(ans), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('H4 Chart Data has been written to the file successfully.');
    }
  });
}, oneHour * 4);

// Generate D1 Chart Data
setInterval(async () => {
  console.log('Go here');
  const data = await chartLogs.find({}).toArray();
  const filePath = 'src/public/d1.json';

  const ans = generateD1ChartData(data).data;

  fs.writeFile(filePath, JSON.stringify(ans), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('D1 Chart Data has been written to the file successfully.');
    }
  });
}, oneHour / 120);
