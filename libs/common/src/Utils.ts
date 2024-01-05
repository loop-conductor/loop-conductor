import { PadCount, ValidationError } from "./Types";

/**
 * Generic utils
 */

/**
 * Convert a value that could be either a scalar or an array into an array.
 * Note that if the provided value is undefined, an empty array will be returned.
 *
 * @param value The value to normalize
 * @returns The normalized value
 */
export const normalizeToArray = <T>(
  value: T | T[] | undefined
): Exclude<T, undefined>[] => {
  if (Array.isArray(value)) {
    return value as Exclude<T, undefined>[];
  }

  if (value === undefined) {
    return [];
  }
  return [value] as Exclude<T, undefined>[];
};

export function isArray<T>(obj: unknown): obj is T[] {
  return Array.isArray(obj);
}

export function arrayFindIndex<T>(arr: T[], cb: (item: T) => boolean): number {
  for (let i = 0; i < arr.length; i++) {
    if (cb(arr[i])) {
      return i;
    }
  }
  return -1;
}

export function arrayFind<T>(
  arr: T[],
  cb: (item: T) => boolean
): T | undefined {
  return arr[arrayFindIndex(arr, cb)];
}

export function isValidationError(obj: unknown): obj is ValidationError {
  const casted = obj as ValidationError;
  if (obj) {
    return typeof casted.Error === "string";
  }
  return false;
}

/**
 * Data validation
 */
export function isValidBarCount(barCount: number): boolean {
  return barCount > 0 && barCount <= 16;
}

export function isValidPadId(padId: unknown): boolean {
  return typeof padId === "number" && padId >= 0 && padId <= PadCount;
}

export class IdGenerator {
  private nextId = 1;

  public id(): number {
    const id = this.nextId;
    this.nextId = this.nextId + 1;
    return id;
  }
}
