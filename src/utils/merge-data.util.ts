import { generateChartKey } from './generate-chart-key.util';

/**
 * Merge data with format [Time, Open, High, Low, Close]
 */
export function mergeData(oldData: any, data: any, type: 'h1' | 'h4' | 'd1' | 'm1' | 'm5' | 'm15'): any {
  if (oldData.length === 0) {
    return data;
  }

  const lastOldCandle = oldData[oldData.length - 1];
  const firstNewCandle = data[0];
  console.log(oldData);

  const lastOldCandleKey = generateChartKey(lastOldCandle[0], type);
  const firstNewCandleKey = generateChartKey(firstNewCandle[0], type);

  if (lastOldCandleKey === firstNewCandleKey) {
    // Update High Value
    lastOldCandle[2] = String(Math.max(Number(lastOldCandle[2]), Number(firstNewCandle[2])));
    // Update Low Value
    lastOldCandle[3] = String(Math.min(Number(lastOldCandle[3]), Number(firstNewCandle[3])));
    // Update Close Value
    lastOldCandle[4] = firstNewCandle[4];

    data.shift();
  }

  for (const candle of data) {
    oldData.push(candle);
  }

  // console.log(lastOldCandle);

  return oldData;
}
