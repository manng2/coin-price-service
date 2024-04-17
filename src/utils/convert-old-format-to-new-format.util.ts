export function convertToNewFormat(data: any): any {
  return data.reduce((prev: any, curr: any) => {
    prev.push([curr.Date, new String(curr.Open), new String(curr.High), new String(curr.Low), new String(curr.Close)]);
    return prev;
  }, [] as any);
}
