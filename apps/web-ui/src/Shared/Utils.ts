import { v4 as uuidv4 } from "uuid";

export function getUUID(): string {
  return uuidv4();
}

/**
 * A simple utility for conditionally joining classNames together
 *
 * @param cNames
 * @returns
 */
export function classNames(...cNames: (string | undefined)[]): string {
  return cNames.filter((cName) => !!cName).join(" ");
}
