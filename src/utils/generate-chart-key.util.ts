export function generateChartKey(timestamp: number, type: 'h1' | 'h4' | 'd1' | 'm1' | 'm5' | 'm15'): string {
  const date = new Date(timestamp);

  switch (type) {
    case 'h1': {
      const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      const hour = ('0' + date.getHours()).slice(-2); // Get hour with leading zero

      return `${day}${month}${year}${hour}`;
    }

    case 'h4': {
      const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      const hour = date.getHours();
      if (hour >= 0 && hour <= 3) {
        return `${day}${month}${year}00`;
      } else if (hour >= 4 && hour <= 7) {
        return `${day}${month}${year}01`;
      } else if (hour >= 8 && hour <= 11) {
        return `${day}${month}${year}02`;
      } else if (hour >= 12 && hour <= 15) {
        return `${day}${month}${year}03`;
      } else if (hour >= 16 && hour <= 19) {
        return `${day}${month}${year}04`;
      } else if (hour >= 20 && hour <= 23) {
        return `${day}${month}${year}05`;
      }

      return '';
    }

    case 'd1': {
      const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

      return `${day}${month}${year}`;
    }

    case 'm1': {
      const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      const hour = ('0' + date.getHours()).slice(-2); // Get hour with leading zero
      const minute = ('0' + date.getMinutes()).slice(-2); // Get minute with leading zero

      return `${day}${month}${year}${hour}${minute}`;
    }

    case 'm5': {
      const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      const hour = ('0' + date.getHours()).slice(-2); // Get hour with leading zero
      const minute = date.getMinutes();
      const minuteGroup = Math.floor(minute / 5); // Group by 5 minutes

      return `${day}${month}${year}${hour}${minuteGroup}`;
    }

    case 'm15': {
      const day = ('0' + date.getDate()).slice(-2); // Get day with leading zero
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
      const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
      const hour = ('0' + date.getHours()).slice(-2); // Get hour with leading zero
      const minute = date.getMinutes();
      const minuteGroup = Math.floor(minute / 15); // Group by 15 minutes

      return `${day}${month}${year}${hour}${minuteGroup}`;
    }

    default:
      return '';
  }
}
