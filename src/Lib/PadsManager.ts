import { getConductorManager, getTaskManager } from "./Globals";
import { PadCount } from "./Types";
import { arrayFind } from "./Utils";

const colors = {
  default: [0.9, 0.9, 0.9, 1],
  disabled: [0.5, 0.5, 0.5, 1],
  active: [0.5, 0.8, 0.5, 1],
};

type PadsConfig = Record<number, unknown[]>;
type Observer = (config: PadsConfig) => void;

export class PadsManager {
  private mapping: Record<number, number> = {};
  private activePads: Record<number, boolean> = {};

  public observe(observer: Observer): () => void {
    return getTaskManager().observe((tasks) => {
      const conductor = getConductorManager();
      const config = this.getDefaultConfig();
      if (conductor) {
        conductor.getSequenceManagers().forEach((sequenceManager, index) => {
          const isActive = !!arrayFind(
            tasks,
            (task) => task.sequenceId === sequenceManager.getId()
          );

          const padId = sequenceManager.getPadId() - 1;
          const padName = sequenceManager.getName() ?? `Seq${index}`;
          config[padId] = this.getPadConfig(
            padName,
            isActive ? "active" : "default"
          );
        });
      }
      observer(config);
    });
  }

  public getDefaultConfig(): PadsConfig {
    const config: PadsConfig = {};

    for (let i = 0; i < PadCount; i++) {
      config[i] = this.getPadConfig("-", "disabled");
    }

    return config;
  }

  public getSequenceIndexFromPadId(padId: number): number {
    return this.mapping[padId] ?? -1;
  }

  private getPadConfig(text: string, color: keyof typeof colors): unknown[] {
    return ["text", text, ",", "activebgcolor", ...colors[color]];
  }
}
