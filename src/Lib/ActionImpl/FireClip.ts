import { getLive } from "../Globals";
import { Clip, FireClipAction, Task } from "../Types";
import { createValidationError } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class FireClipActionImpl extends ActionImpl<FireClipAction> {
  public validate() {
    const { action, path } = this;
    if (!getLive().isValidScene(action.sceneName)) {
      throw createValidationError(`Invalid scene name (${action.sceneName})`, [
        ...path,
        "sceneName",
      ]);
    }
    if (!getLive().isValidTrack(action.trackName)) {
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
    const sceneIndex = getLive().getSceneIndex(action.sceneName);
    const trackIndex = getLive().getTrackIndex(action.trackName);
    return [
      this.createTask({
        timepoint: this.getNextBarTime({ at: action.at ?? 0 }),
        callback: () => {
          getLive().getTrack(trackIndex).getClipSlot(sceneIndex).fire();
        },
      }),
    ];
  }
}
