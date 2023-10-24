import { getLive } from "../Globals";
import { ArmTrackAction, Clip, Task } from "../Types";
import { createValidationError, patchSceneOrTrackName } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class ArmTrackActionImpl extends ActionImpl<ArmTrackAction> {
  public validateAndPatch() {
    this.action.trackName = patchSceneOrTrackName(this.action.trackName);

    const { action, path } = this;

    if (!getLive().isValidTrack(this.action.trackName)) {
      throw createValidationError(`Invalid track name (${action.trackName})`, [
        ...path,
        "trackName",
      ]);
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
          getLive()
            .getTrack(action.trackName)
            .arm(action.armed ?? 1);
        },
      }),
    ];
  }
}
