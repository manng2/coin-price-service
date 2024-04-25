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
  fetchingAndUpdateNewData('h1');
}, oneHour);

// Generate H4 Chart Data
setInterval(async () => {
  fetchingAndUpdateNewData('h4');
}, oneHour * 4);

// Generate D1 Chart Data
setInterval(async () => {
  fetchingAndUpdateNewData('d1');
}, oneHour * 24);

async function fetchingAndUpdateNewData(type: 'h1' | 'h4' | 'd1'): Promise<void> {
  console.log(`Generating latest ${type} Chart Data...`);
  const { lastReadIdx, data: oldData } = getLastReadIdxAndData(type);

  const data = await chartLogs
    .find({})
    .skip(lastReadIdx ? lastReadIdx + 1 : 0)
    .toArray();
  const filePath = `src/public/${type}.json`;

  if (!data.length) {
    console.log('No newest data!');
    return;
  }

  const genFn = type === 'h1' ? generateH1ChartData : type === 'h4' ? generateH4ChartData : generateD1ChartData;

  const ans = genFn(data).data;
  const newData = [...ans, ...oldData];

  fs.writeFile(
    filePath,
    JSON.stringify({
      lastReadIdx: newData.length - 1,
      data: newData,
    }),
    (err) => {
      if (err) {
        console.error('Error writing JSON to file:', err);
      } else {
        console.log(`${type} Chart Data has been written to the file successfully.`);
      }
    },
  );
}

function getLastReadIdxAndData(type: 'h1' | 'h4' | 'd1'): {
  lastReadIdx: number;
  data: any;
} {
  const filePath = `src/public/${type}.json`;

  try {
    // Read JSON data from file
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse JSON data
    const { lastReadIdx, data } = JSON.parse(jsonData);

    // Send the JSON data as a response
    return {
      lastReadIdx,
      data,
    };
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return {
      lastReadIdx: 1,
      data: [],
    };
  }
}
