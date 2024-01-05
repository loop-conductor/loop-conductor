import { PadCount, arrayFind } from "@loop-conductor/common";
import { getConductorManager, getTaskManager } from "./Globals";

const colors = {
  default: [0.9, 0.9, 0.9, 1],
  disabled: [0.5, 0.5, 0.5, 1],
  active: [0.5, 0.8, 0.5, 1],
};

type PadsConfig = Record<number, unknown[]>;
type Observer = (config: PadsConfig) => void;

export class PadsManager {
  private mapping: Record<number, number> = {};

  public observe(observer: Observer): () => void {
    return getTaskManager().observe((tasks) => {
      const conductorModel = getConductorManager();
      const config = this.getDefaultConfig();
      if (conductorModel) {
        conductorModel.conductor?.sequences.forEach((sequence, index) => {
          const isActive = !!arrayFind(
            tasks,
            (task) => task.sequenceId === sequence.id
          );

          const padId = sequence.padId - 1;
          config[padId] = this.getPadConfig(isActive, true);
        });
      }
      observer(config);
    });
  }

  public getDefaultConfig(): PadsConfig {
    const config: PadsConfig = {};

    for (let i = 0; i < PadCount; i++) {
      config[i] = this.getPadConfig(false, false);
    }

    return config;
  }

  public getSequenceIndexFromPadId(padId: number): number {
    return this.mapping[padId] ?? -1;
  }

  private getPadConfig(state: boolean, active: boolean): unknown[] {
    // This is a content of a max message that will set the pad button
    // toggle state and active state
    return ["set", state ? 1 : 0, ",", "active", active ? 1 : 0];
  }
}
