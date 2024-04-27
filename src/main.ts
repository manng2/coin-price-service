import fs from 'fs';
import app from './server';
import { generateD1ChartData, generateH1ChartData, generateH4ChartData } from './utils';
import { chartLogs, initMongoDBClient } from './utils/db-client.util';
import { getLastReadIdxAndData } from './utils/get-latest-read-idx-and-data.util';

const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://mannguyen:ECEvPdeEHCguvD3V@cluster0.ckbyr09.mongodb.net/?retryWrites=true&w=majority';
const MAX_READ_RECORDS = 300000;
// initializeRedisClient();

initMongoDBClient(uri).then(async () => {
  const { lastReadIdx, data: oldData } = getLastReadIdxAndData('h1');

  // Only running prefetching if there is data
  if (oldData.length) {
    const data = await chartLogs
      .find({})
      .skip(lastReadIdx ? lastReadIdx + 1 : 0)
      .limit(MAX_READ_RECORDS)
      .toArray();

    if (data.length) {
      await updateLatestDataByLastReadIdx(data);
    } else {
      console.log('Congrats! Data is cleaned or latest');
    }
  }

  app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});

// Generate H1 Chart Data
// setInterval(async () => {
//   fetchingAndUpdateNewData('h1');
// }, oneHour);

// Generate H4 Chart Data
// setInterval(async () => {
//   fetchingAndUpdateNewData('h4');
// }, oneHour * 4);

// Generate D1 Chart Data
// setInterval(async () => {
//   fetchingAndUpdateNewData('d1');
// }, oneHour * 24);

async function updateLatestDataByLastReadIdx(data: any): Promise<void> {
  console.log(`Outdated data, generating latest Chart Data...`);
  return Promise.all([updateNewData('h1', data), updateNewData('h4', data), updateNewData('d1', data)]).then();
}

function updateNewData(type: 'h1' | 'h4' | 'd1', data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const { lastReadIdx, data: oldData } = getLastReadIdxAndData(type);
    const genFn = type === 'h1' ? generateH1ChartData : type === 'h4' ? generateH4ChartData : generateD1ChartData;
    const newChartData = genFn(data).data;
    const filePath = `src/public/${type}.json`;

    if (oldData.length > 0 && oldData[oldData.length - 1][0] === newChartData[0][0]) {
      oldData[oldData.length - 1] = newChartData[0];
      newChartData.shift();
    }

    for (const value of newChartData) {
      oldData.push(value);
    }

    fs.writeFile(
      filePath,
      JSON.stringify({
        lastReadIdx: lastReadIdx ? lastReadIdx + data.length : lastReadIdx + data.length - 1,
        data: oldData,
      }),
      (err) => {
        if (err) {
          console.error('Error writing JSON to file:', err);
          reject(new Error('Error writing JSON to file'));
        } else {
          console.log(`[Update case] ${type} Chart Data has been updated to the file successfully.`);
          resolve();
        }
      },
    );
  });
}
