import fs from 'fs';

export function getLastReadIdxAndData(type: 'h1' | 'h4' | 'd1'): {
  lastReadIdx: number;
  data: any;
} {
  const filePath = `src/public/${type}.json`;

  try {
    // Read JSON data from file
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse JSON data
    const { lastReadIdx, data } = JSON.parse(jsonData);

    // Send the JSON data as a response
    return {
      lastReadIdx,
      data,
    };
  } catch (error) {
    console.log('No data, return default value...');
    return {
      lastReadIdx: 0,
      data: [],
    };
  }
}
