import { convertToNewFormat } from './convert-old-format-to-new-format.util';
import { generateChartKey } from './generate-chart-key.util';

export function generateH1ChartData(data: any) {
  const rangeMap: Record<string, any> = {};
  if (data.length === 0) {
    return {
      data: [],
      lastReadTime: 0,
    };
  }

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
  if (data.length === 0) {
    return {
      data: [],
      lastReadTime: 0,
    };
  }

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
  if (data.length === 0) {
    return {
      data: [],
      lastReadTime: 0,
    };
  }

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
