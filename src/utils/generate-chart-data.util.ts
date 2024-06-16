import { convertToNewFormat } from './convert-old-format-to-new-format.util';
import { generateChartKey } from './generate-chart-key.util';
import { setDateByChartType } from './set-date-by-chart-type.util';

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
      let date = new Date(it.time);
      date = setDateByChartType(date, 'h1');

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
      let date = new Date(it.time);
      date = setDateByChartType(date, 'd1');

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
      let date = new Date(it.time);
      date = setDateByChartType(date, 'h4');

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

export function generateM1ChartData(data: any) {
  const rangeMap: Record<string, any> = {};
  if (data.length === 0) {
    return {
      data: [],
      lastReadTime: 0,
    };
  }

  data.forEach((it: any) => {
    const key = generateChartKey(it.time, 'm1');

    if (rangeMap[key]) {
      rangeMap[key] = {
        ...rangeMap[key],
        Close: it.value,
        Low: Math.min(rangeMap[key].Low, it.value),
        High: Math.max(rangeMap[key].High, it.value),
      };
    } else {
      let date = new Date(it.time);
      date = setDateByChartType(date, 'm1');

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

export function generateM5ChartData(data: any) {
  const rangeMap: Record<string, any> = {};
  if (data.length === 0) {
    return {
      data: [],
      lastReadTime: 0,
    };
  }

  data.forEach((it: any) => {
    const key = generateChartKey(it.time, 'm5');

    if (rangeMap[key]) {
      rangeMap[key] = {
        ...rangeMap[key],
        Close: it.value,
        Low: Math.min(rangeMap[key].Low, it.value),
        High: Math.max(rangeMap[key].High, it.value),
      };
    } else {
      let date = new Date(it.time);
      date = setDateByChartType(date, 'm5');

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

export function generateM15ChartData(data: any) {
  const rangeMap: Record<string, any> = {};
  if (data.length === 0) {
    return {
      data: [],
      lastReadTime: 0,
    };
  }

  data.forEach((it: any) => {
    const key = generateChartKey(it.time, 'm15');

    if (rangeMap[key]) {
      rangeMap[key] = {
        ...rangeMap[key],
        Close: it.value,
        Low: Math.min(rangeMap[key].Low, it.value),
        High: Math.max(rangeMap[key].High, it.value),
      };
    } else {
      let date = new Date(it.time);
      date = setDateByChartType(date, 'm15');

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
