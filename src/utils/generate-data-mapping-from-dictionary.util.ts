export function generateDataMappingFromDictionary<T>(dictionary: Record<string, string[]>): Map<string, T> {
  const result = new Map<string, T>();

  Object.entries(dictionary).forEach((pair) => {
    const [key, dirtyKeys] = pair;
    dirtyKeys.forEach((it) => result.set(it, key as T));
  });

  return result;
}
