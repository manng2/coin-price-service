import { Request, Response } from 'express';
import { chartLogs } from '../utils/db-client.util';
import { generateChartKey } from '../utils/generate-chart-key.util';
import { convertToNewFormat } from '../utils/convert-old-format-to-new-format.util';

// interface ChartLog {
//   _id: string;
//   time: number;
//   value: number;
// }

function generateH1ChartData(data: any) {
  const rangeMap: Record<string, any> = {};
  data.forEach((it: any) => {
    const key = generateChartKey(it.time, 'h1') as string;

    if (rangeMap[key]) {
      rangeMap[key] = {
        ...rangeMap[key],
        Close: it.value,
        Low: Math.min(rangeMap[key].Low, it.value),
        High: Math.max(rangeMap[key].High, it.value),
      };
    } else {
      const date = new Date(it.time);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      rangeMap[key] = {
        Close: it.value,
        Open: it.value,
        Low: it.value,
        High: it.value,
        Date: date.getTime(),
      };
    }
  });

  return {
    data: convertToNewFormat(Object.values(rangeMap).sort((a, b) => a.Date - b.Date)),
    lastReadTime: data[data.length - 1].time,
  };
}

export function generateD1ChartData(data: any) {
  const rangeMap: Record<string, any> = {};
  data.forEach((it: any) => {
    const key = generateChartKey(it.time, 'd1');

    if (rangeMap[key]) {
      rangeMap[key] = {
        ...rangeMap[key],
        Close: it.value,
        Low: Math.min(rangeMap[key].Low, it.value),
        High: Math.max(rangeMap[key].High, it.value),
      };
    } else {
      const date = new Date(it.time);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      rangeMap[key] = {
        Close: it.value,
        Open: it.value,
        Low: it.value,
        High: it.value,
        Date: date.getTime(),
      };
    }
  });

  return {
    data: convertToNewFormat(Object.values(rangeMap).sort((a, b) => a.Date - b.Date)),
    lastReadTime: data[data.length - 1].time,
  };
}

export function generateH4ChartData(data: any) {
  const rangeMap: Record<string, any> = {};
  data.forEach((it: any) => {
    const key = generateChartKey(it.time, 'h4');

    if (rangeMap[key]) {
      rangeMap[key] = {
        ...rangeMap[key],
        Close: it.value,
        Low: Math.min(rangeMap[key].Low, it.value),
        High: Math.max(rangeMap[key].High, it.value),
      };
    } else {
      const date = new Date(it.time);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      rangeMap[key] = {
        Close: it.value,
        Open: it.value,
        Low: it.value,
        High: it.value,
        Date: date.getTime(),
      };
    }
  });

  return {
    data: convertToNewFormat(Object.values(rangeMap).sort((a, b) => a.Date - b.Date)),
    lastReadTime: data[data.length - 1].time,
  };
}

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
