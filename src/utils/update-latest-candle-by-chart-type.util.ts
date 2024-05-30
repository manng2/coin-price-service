import { generateChartKey } from './generate-chart-key.util';
import { getLastReadIdxAndData } from './get-latest-read-idx-and-data.util';
import fs from 'fs';

export function updateLatestCandleByChartType(type: 'h1' | 'h4' | 'd1' | 'm1' | 'm5' | 'm15', time: number, price: number) {
  const key = generateChartKey(time, type);
  const { lastReadIdx, data } = getLastReadIdxAndData(type);
  const lastDataKey = generateChartKey(data[data.length - 1][0], type);
  const filePath = `src/public/${type}.json`;

  if (key === lastDataKey) {
    const [timestamp, open, high, low] = data[data.length - 1];

    data[data.length - 1] = [timestamp, open, String(Math.max(Number(high), price)), String(Math.min(Number(low), price)), String(price)];
  } else {
    const date = new Date(time);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const priceStr = String(price);

    const newData = [date.getTime(), priceStr, priceStr, priceStr, priceStr];
    data.push(newData);
  }

  fs.writeFile(
    filePath,
    JSON.stringify({
      lastReadIdx: lastReadIdx + 1,
      data,
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
