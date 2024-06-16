export function setDateByChartType(date: Date, type: 'h1' | 'h4' | 'd1' | 'm1' | 'm5' | 'm15'): Date {
  if (['h1', 'h4', 'd1'].includes(type)) {
    date.setMinutes(0);
  } else {
    const minutes = date.getMinutes();
    switch (type) {
      case 'm1': {
        date.setMinutes(Math.floor(minutes / 1));
        break;
      }
      case 'm5': {
        date.setMinutes(Math.floor(minutes / 5) * 5);
        break;
      }
      case 'm15': {
        date.setMinutes(Math.floor(minutes / 15) * 15);
        break;
      }
    }
  }

  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}