import { Conductor } from "@loop-conductor/common";

export interface Storage {
  loadedConductorId: string | undefined;
  conductors: Conductor[];

  midiOutputName: string | undefined;
}
