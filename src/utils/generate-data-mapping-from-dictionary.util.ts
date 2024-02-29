export function generateDataMappingFromDictionary<T>(dictionary: Record<string, string[]>): Record<string, T> {
  const result: Record<string, T> = {};

  Object.entries(dictionary).forEach((pair) => {
    const [key, dirtyKeys] = pair;
    dirtyKeys.forEach((it) => (result[it] = key as T));
  });

  return result;
}
