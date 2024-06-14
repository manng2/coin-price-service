import { Request, Response } from 'express';
import fs from 'fs';
import { generateD1ChartData, generateH1ChartData, generateH4ChartData } from '../utils';
import { chartLogs } from '../utils/db-client.util';
import { getLastReadIdxAndData } from '../utils/get-latest-read-idx-and-data.util';
import { mergeData } from '../utils/merge-data.util';
import { updateLatestCandleByChartType } from '../utils/update-latest-candle-by-chart-type.util';

// interface ChartLog {
//   _id: string;
//   time: number;
//   value: number;
// }

// export async function getPrice(req: Request, res: Response) {
//   const { chart } = req.query;
//   const data = await chartLogs.find({}).toArray();
//   let ans: any;

//   switch (chart) {
//     case 'h1': {
//       ans = generateH1ChartData(data).data;

//       break;
//     }
//     case 'h4': {
//       ans = generateH4ChartData(data).data;

//       break;
//     }
//     case 'd1': {
//       ans = generateD1ChartData(data).data;

//       break;
//     }
//     default: {
//       ans = generateD1ChartData(data).data;

//       break;
//     }
//   }

//   return res.status(200).json(ans);
// }

export async function getLatestPrice(req: Request, res: Response) {
  const { chart } = req.query;
  const filePath = `src/public/${(chart as string).toLowerCase()}.json`;

  try {
    // Read JSON data from file
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse JSON data
    const { data } = JSON.parse(jsonData);

    // Send the JSON data as a response
    return res.status(200).json([data[data.length - 1]]);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateJsonData(req: Request, res: Response) {
  const startFetchingTime = performance.now();
  const { data, lastIdx } = await getAllRecords();
  const endFetchingTime = performance.now();

  console.log(`Total time to finish task: ${((endFetchingTime - startFetchingTime) / 1000).toFixed(2)} seconds with ${data.length} records`);

  if (data.length === 0) {
    return res.status(200).json({
      message: 'No new records',
    });
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
    data: mergeData(oldDataM1, generateD1ChartData(data).data, 'm1'),
  };

  const { data: oldDataM5 } = getLastReadIdxAndData('m5');

  const m5ChartData = {
    lastReadIdx: lastIdx,
    data: mergeData(oldDataM5, generateD1ChartData(data).data, 'm5'),
  };

  const { data: oldDataM15 } = getLastReadIdxAndData('m15');

  const m15ChartData = {
    lastReadIdx: lastIdx,
    data: mergeData(oldDataM15, generateD1ChartData(data).data, 'm15'),
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

  return res.status(200).json({
    message: 'Updated successfully',
  });
}

export function getJsonData(req: Request, res: Response) {
  const { chart } = req.query;
  const filePath = `src/public/${(chart as string).toLowerCase()}.json`;

  try {
    // Read JSON data from file
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse JSON data
    const { data } = JSON.parse(jsonData);

    // Send the JSON data as a response
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export function updateLatestCandle(req: Request, res: Response) {
  const { time, price } = req.body;
  updateLatestCandleByChartType('h1', time, price);
  updateLatestCandleByChartType('h4', time, price);
  updateLatestCandleByChartType('d1', time, price);
  updateLatestCandleByChartType('m1', time, price);
  updateLatestCandleByChartType('m5', time, price);
  updateLatestCandleByChartType('m15', time, price);

  return res.status(200).json({
    message: 'Updated successfully',
  });
}

// function updateLatestCandleByChartType(type: 'h1' | 'h4' | 'd1' | 'm1' | 'm5' | 'm15', time: number, price: number) {
//   const key = generateChartKey(time, type);
//   const { lastReadIdx, data } = getLastReadIdxAndData(type);
//   const lastDataKey = generateChartKey(data[data.length - 1][0], type);
//   const filePath = `src/public/${type}.json`;

//   if (key === lastDataKey) {
//     const [timestamp, open, high, low] = data[data.length - 1];

//     data[data.length - 1] = [timestamp, open, String(Math.max(Number(high), price)), String(Math.min(Number(low), price)), String(price)];
//   } else {
//     const date = new Date(time);
//     date.setMinutes(0);
//     date.setSeconds(0);
//     date.setMilliseconds(0);
//     const priceStr = String(price);

//     const newData = [date.getTime(), priceStr, priceStr, priceStr, priceStr];
//     data.push(newData);
//   }

//   fs.writeFile(
//     filePath,
//     JSON.stringify({
//       lastReadIdx: lastReadIdx + 1,
//       data,
//     }),
//     (err) => {
//       if (err) {
//         console.error('Error writing JSON to file:', err);
//       } else {
//         console.log(`${type} Chart Data has been written to the file successfully.`);
//       }
//     },
//   );
// }

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

    lastIdx += pageSize;
  }

  return {
    data: allRecords,
    lastIdx: lastIdx - 1,
  };
}
