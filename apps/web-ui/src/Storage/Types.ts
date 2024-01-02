import { Conductor } from "@loop-conductor/common";

export interface Storage {
  loadedConductorId: string | null;
  conductors: Conductor[];
}
