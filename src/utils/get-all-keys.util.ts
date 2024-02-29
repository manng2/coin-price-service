export function getAllKeys(obj: object): string[] {
  const keys = Object.keys(obj);

  return keys.reduce((acc: string[], key: string) => {
    const value = obj[key as keyof typeof obj];

    if (typeof value === 'object' && !!value && !Array.isArray(value)) {
      acc = acc.concat(key);
      return acc.concat(getAllKeys(obj[key as keyof typeof obj]).map((k) => `${key}.${k}`));
    }
    return acc.concat(key);
  }, []);
}
