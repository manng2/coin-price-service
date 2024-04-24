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
  const filePath = `src/public/${chart}.json`;

  try {
    // Read JSON data from file
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse JSON data
    const data = JSON.parse(jsonData);

    // Send the JSON data as a response
    return res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
