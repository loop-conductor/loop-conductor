import { Conductor } from "../Shared";

export interface Storage {
  loadedConductorId: string | null;
  conductors: Conductor[];
}
