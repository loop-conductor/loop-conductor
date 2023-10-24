import { getLive } from "../Globals";
import { Clip, Task, TempoAction } from "../Types";
import { createValidationError } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class TempoActionImpl extends ActionImpl<TempoAction> {
  public validateAndPatch() {
    const { action, path } = this;
    if (typeof action.tempo !== "number") {
      throw createValidationError("Invalid tempo value", [...path, "enabled"]);
    }
  }

  public getDuration(): number {
    return 0;
  }

  public getManagedClips(): Clip[] | null {
    return null;
  }

  public getTasks(): Task[] {
    const { action } = this;
    return [
      this.createTask({
        timepoint: this.getNextBarTime({ at: action.at ?? 0 }),
        callback: () => {
          getLive().setTempo(action.tempo);
        },
      }),
    ];
  }
}
