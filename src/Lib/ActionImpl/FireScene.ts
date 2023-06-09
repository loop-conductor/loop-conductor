import { getLive } from "../Globals";
import { Clip, FireSceneAction, Task } from "../Types";
import { createValidationError } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class FireSceneActionImpl extends ActionImpl<FireSceneAction> {
  public validate() {
    const { action, path } = this;
    if (!getLive().isValidScene(action.sceneName)) {
      throw createValidationError(`Invalid scene name (${action.sceneName})`, [
        ...path,
        "sceneName",
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
    return [
      this.createTask({
        timepoint: this.getNextBarTime({ at: action.at ?? 0 }),
        callback: () => {
          getLive().getScene(sceneIndex).fire();
        },
      }),
    ];
  }
}
