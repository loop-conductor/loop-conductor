import { getLive } from "../Globals";
import { Clip, FireClipAction, Task } from "../Types";
import { createValidationError, patchSceneOrTrackName } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class FireClipActionImpl extends ActionImpl<FireClipAction> {
  public validateAndPatch() {
    this.action.trackName = patchSceneOrTrackName(this.action.trackName);
    this.action.sceneName = patchSceneOrTrackName(this.action.sceneName);

    const { action, path } = this;

    if (!getLive().isValidScene(this.action.sceneName)) {
      throw createValidationError(`Invalid scene name`, [...path, "sceneName"]);
    }
    if (!getLive().isValidTrack(this.action.trackName)) {
      throw createValidationError(`Invalid track name`, [...path, "trackName"]);
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
