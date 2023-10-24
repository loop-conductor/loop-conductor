import { getLive } from "../Globals";
import { Clip, MetronomeAction, Task } from "../Types";
import { createValidationError } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class MetronomeActionImpl extends ActionImpl<MetronomeAction> {
  public validateAndPatch() {
    const { action, path } = this;
    if (typeof action.enable !== "number") {
      throw createValidationError("Invalid enabled value", [...path, "enable"]);
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
          getLive().setMetronome(action.enable);
        },
      }),
    ];
  }
}
