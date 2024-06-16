import { generateH1ChartData, generateH4ChartData, generateD1ChartData, generateM15ChartData, generateM1ChartData, generateM5ChartData } from "./utils";
import { chartLogs, initMongoDBClient } from "./utils/db-client.util";
import { getLastReadIdxAndData } from "./utils/get-latest-read-idx-and-data.util";
import { mergeData } from "./utils/merge-data.util";
import fs from 'fs';

async function getAllRecords() {
  const { lastReadIdx } = getLastReadIdxAndData('h1');
  const pageSize = Number(process.env.PAGE_SIZE) || 1000; // Number of records to fetch per page
  let lastIdx = lastReadIdx ? lastReadIdx + 1 : 0;
  const MAX_READ_RECORDS = Number(process.env.MAX_READ_RECORDS) || 1000000;
  const allRecords: any[] = [];
  const alwaysTrue = true;

  while (alwaysTrue && allRecords.length < MAX_READ_RECORDS) {
    console.log(`[Page: ${Math.round(lastIdx / pageSize)}, Index: ${lastIdx}, Total Records: ${allRecords.length}] Fetching...`);
    const records = await chartLogs.find({}).skip(lastIdx).limit(pageSize).toArray();

    if (records.length === 0) {
      break;
    }

    for (const record of records) {
      allRecords.push(record);
    }

    lastIdx += records.length;
  }

  return {
    data: allRecords,
    lastIdx: lastIdx - 1,
  };
}


async function migration() {
  const startFetchingTime = performance.now();
  const { data, lastIdx } = await getAllRecords();
  const endFetchingTime = performance.now();

  console.log(`Total time to finish task: ${((endFetchingTime - startFetchingTime) / 1000).toFixed(2)} seconds with ${data.length} records`);

  if (data.length === 0) {
    console.log('No new records');
  }

  const h1FilePath = 'src/public/h1.json';
  const h4FilePath = 'src/public/h4.json';
  const d1FilePath = 'src/public/d1.json';
  const m1FilePath = 'src/public/m1.json';
  const m5FilePath = 'src/public/m5.json';
  const m15FilePath = 'src/public/m15.json';

  const { data: oldDataH1 } = getLastReadIdxAndData('h1');

  const h1ChartData = {
    lastReadIdx: lastIdx,
    data: mergeData(oldDataH1, generateH1ChartData(data).data, 'h1'),
  };

  const { data: oldDataH4 } = getLastReadIdxAndData('h4');

  const h4ChartData = {
    lastReadIdx: lastIdx,
    data: mergeData(oldDataH4, generateH4ChartData(data).data, 'h4'),
  };

  const { data: oldDataD1 } = getLastReadIdxAndData('d1');

  const d1ChartData = {
    lastReadIdx: lastIdx,
    data: mergeData(oldDataD1, generateD1ChartData(data).data, 'd1'),
  };

  const { data: oldDataM1 } = getLastReadIdxAndData('m1');

  const m1ChartData = {
    lastReadIdx: lastIdx,
    data: mergeData(oldDataM1, generateM1ChartData(data).data, 'm1'),
  };

  const { data: oldDataM5 } = getLastReadIdxAndData('m5');

  const m5ChartData = {
    lastReadIdx: lastIdx,
    data: mergeData(oldDataM5, generateM5ChartData(data).data, 'm5'),
  };

  const { data: oldDataM15 } = getLastReadIdxAndData('m15');

  const m15ChartData = {
    lastReadIdx: lastIdx,
    data: mergeData(oldDataM15, generateM15ChartData(data).data, 'm15'),
  };

  fs.writeFile(h1FilePath, JSON.stringify(h1ChartData), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('H1 Chart Data has been written to the file successfully.');
    }
  });

  fs.writeFile(h4FilePath, JSON.stringify(h4ChartData), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('H4 Chart Data has been written to the file successfully.');
    }
  });

  fs.writeFile(d1FilePath, JSON.stringify(d1ChartData), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('D1 Chart Data has been written to the file successfully.');
    }
  });

  fs.writeFile(m1FilePath, JSON.stringify(m1ChartData), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('M1 Chart Data has been written to the file successfully.');
    }
  });

  fs.writeFile(m5FilePath, JSON.stringify(m5ChartData), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('M5 Chart Data has been written to the file successfully.');
    }
  });

  fs.writeFile(m15FilePath, JSON.stringify(m15ChartData), (err) => {
    if (err) {
      console.error('Error writing JSON to file:', err);
    } else {
      console.log('M15 Chart Data has been written to the file successfully.');
    }
  });

  console.log('Updated successfully');

  return data.length;
}

const uri = 'mongodb+srv://mikenguyen:zaszaszas123@coin-price-service.yduvks2.mongodb.net/?retryWrites=true&w=majority&appName=coin-price-service';

initMongoDBClient(uri).then(() => {
  return migration();
});
