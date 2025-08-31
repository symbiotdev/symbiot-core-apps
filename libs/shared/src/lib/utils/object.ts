export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getValueByObjectPath<T>(obj: T, path: string) {
  return path
    .split('.')
    .reduce<
      unknown | undefined
    >((o, key) => (key && typeof o === 'object' && o !== null && key in o ? (o as Record<string, unknown>)?.[key] : undefined), obj);
}

export function objectsEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (!isObject(a) || !isObject(b)) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }

    const valA = (a as Record<string, unknown>)[key];
    const valB = (b as Record<string, unknown>)[key];

    if (!objectsEqual(valA, valB)) {
      return false;
    }
  }

  return true;
}

export function arraysOfObjectsEqual(
  arrA: unknown[],
  arrB: unknown[],
): boolean {
  if (!Array.isArray(arrA) || !Array.isArray(arrB)) return false;
  if (arrA.length !== arrB.length) return false;

  for (let i = 0; i < arrA.length; i++) {
    if (!objectsEqual(arrA[i], arrB[i])) {
      return false;
    }
  }

  return true;
}
