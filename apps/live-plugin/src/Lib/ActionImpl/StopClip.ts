import { getLive } from "../Globals";
import { Clip, StopClipAction, Task } from "../Types";
import { createValidationError, patchSceneOrTrackName } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class StopClipActionImpl extends ActionImpl<StopClipAction> {
  public validateAndPatch() {
    this.action.sceneName = patchSceneOrTrackName(this.action.sceneName);
    this.action.trackName = patchSceneOrTrackName(this.action.trackName);

    const { action, path } = this;

    if (!getLive().isValidScene(action.sceneName)) {
      throw createValidationError("Invalid scene name", [...path, "sceneName"]);
    }
    if (!getLive().isValidTrack(action.trackName)) {
      throw createValidationError("Invalid track name", [...path, "trackName"]);
    }
  }

  public getDuration(): number {
    return 0;
  }

  public getManagedClips(): Clip | null {
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
          getLive().getTrack(trackIndex).getClipSlot(sceneIndex).stop();
        },
      }),
    ];
  }
}
