import { Action } from "./Types";

/**
 * Return the duration in bar of a given action.
 *
 * @param action The action to get the duration
 * @returns The duration in bars
 */
export function getActionBarCount(action: Action): number {
  // Make sure that "in" is correctly supported in max
  if ("barCount" in action) {
    return action.barCount;
  }
  return 0;
}
