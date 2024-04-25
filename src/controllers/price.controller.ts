import { Request, Response } from 'express';
import fs from 'fs';
import { generateD1ChartData, generateH1ChartData, generateH4ChartData } from '../utils';
import { chartLogs } from '../utils/db-client.util';

// interface ChartLog {
//   _id: string;
//   time: number;
//   value: number;
// }

export async function getPrice(req: Request, res: Response) {
  const { chart } = req.query;
  const data = await chartLogs.find({}).toArray();
  let ans: any;

  switch (chart) {
    case 'h1': {
      ans = generateH1ChartData(data).data;

      break;
    }
    case 'h4': {
      ans = generateH4ChartData(data).data;

      break;
    }
    case 'd1': {
      ans = generateD1ChartData(data).data;

      break;
    }
    default: {
      ans = generateD1ChartData(data).data;

      break;
    }
  }

  return res.status(200).json(ans);
}

export async function getLatestPrice(req: Request, res: Response) {
  const { chart } = req.query;
  const filePath = `src/public/${(chart as string).toLowerCase()}.json`;

  try {
    // Read JSON data from file
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse JSON data
    const { data } = JSON.parse(jsonData);

    // Send the JSON data as a response
    return res.status(200).json(data[data.length - 1]);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateJsonData(req: Request, res: Response) {
  const startFetchingTime = performance.now();
  const data = await getAllRecords();
  const endFetchingTime = performance.now();

  console.log(`Total time to finish task: ${((endFetchingTime - startFetchingTime) / 1000).toFixed(2)} seconds`);

  const h1FilePath = 'src/public/h1.json';
  const h4FilePath = 'src/public/h4.json';
  const d1FilePath = 'src/public/d1.json';

  const h1ChartData = {
    lastReadIdx: data.length - 1,
    data: generateH1ChartData(data).data,
  };
  const h4ChartData = {
    lastReadIdx: data.length - 1,
    data: generateH4ChartData(data).data,
  };
  const d1ChartData = {
    lastReadIdx: data.length - 1,
    data: generateD1ChartData(data).data,
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

  res.status(200);
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

async function getAllRecords() {
  const pageSize = 1000; // Number of records to fetch per page
  let page = 1;
  let allRecords: any[] = [];
  const alwaysTrue = true;

  while (alwaysTrue) {
    console.log(`[Page: ${page}, Total Records: ${allRecords.length}] Fetched`);
    const records = await chartLogs
      .find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    if (records.length === 0) {
      break; // No more records found
    }

    allRecords = [...records, ...allRecords];
    page++;
  }

  return allRecords;
}
