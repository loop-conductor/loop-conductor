import { Conductor } from "@loop-conductor/common";
import { useMemo } from "react";

export function useAvailablePadIds(conductor?: Conductor): number[] {
  const usedPadId = useMemo(() => {
    const usedPadId: Set<number> = new Set();
    conductor?.sequences.forEach((sequence) => {
      usedPadId.add(sequence.padId);
    });

    return Array.from(usedPadId);
  }, [conductor]);

  return useMemo(() => {
    const availablePadId: number[] = [];
    for (let i = 1; i <= 12; i++) {
      if (!usedPadId.includes(i)) {
        availablePadId.push(i);
      }
    }

    return availablePadId;
  }, [usedPadId]);
}
