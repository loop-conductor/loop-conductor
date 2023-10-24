import { getLive } from "../Globals";
import { barsToBeats, barsToTicks } from "../Time";
import { Clip, RecordLoopAction, Task } from "../Types";
import {
  createValidationError,
  isValidBarCount,
  patchSceneOrTrackName,
} from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class RecordLoopActionImpl extends ActionImpl<RecordLoopAction> {
  public validateAndPatch() {
    this.action.sceneName = patchSceneOrTrackName(this.action.sceneName);
    this.action.trackName = patchSceneOrTrackName(this.action.trackName);

    const { action, path } = this;

    if (!getLive().isValidScene(action.sceneName)) {
      throw createValidationError(`Invalid scene name`, [...path, "sceneName"]);
    }
    if (!getLive().isValidTrack(action.trackName)) {
      throw createValidationError(`Invalid track name`, [...path, "trackName"]);
    }
    if (!isValidBarCount(action.barCount)) {
      throw createValidationError(`Invalid bar count (${action.barCount})`, [
        ...path,
        "barCount",
      ]);
    }
  }

  public getDuration(): number {
    return barsToTicks(
      this.action.barCount,
      getLive().getCurrentTimeSignature()
    );
  }

  public getManagedClips(): Clip | null {
    const { action } = this;
    return {
      trackName: action.trackName,
      sceneName: action.sceneName,
    };
  }

  public getTasks(): Task[] {
    const { action } = this;
    const sceneIndex = getLive().getSceneIndex(action.sceneName);
    const trackIndex = getLive().getTrackIndex(action.trackName);
    const tSig = getLive().getCurrentTimeSignature();

    const startTime = this.getNextBarTime({ at: action.at ?? 0 });
    const stopTime = this.getNextBarTime({
      at: (action.at ?? 0) + action.barCount,
    });
    const recordLength = barsToBeats(action.barCount, tSig);
    const unarmOnStop = action.unarmOnStop ?? 1;
    const unarmOthersOnStart = action.unarmOthersOnStart ?? 1;

    return [
      // Start recording task
      this.createTask({
        timepoint: startTime,
        callback: () => {
          // First unarm all other tracks
          if (unarmOthersOnStart) {
            for (let i = 0; i < getLive().getTrackCount(); i++) {
              if (i !== trackIndex) {
                getLive().getTrack(i).arm(0);
              }
            }
          }

          // Then arm the track
          var track = getLive().getTrack(trackIndex);
          track.arm(1);

          // Then delete any existing clip
          var clipSlot = track.getClipSlot(sceneIndex);
          if (clipSlot.hasClip()) {
            clipSlot.deleteClip();
          }

          // Then start recording
          clipSlot.fire(recordLength);
        },
      }),
      // Stop recording task
      this.createTask({
        timepoint: stopTime,
        callback: () => {
          if (unarmOnStop) {
            getLive().getTrack(trackIndex).arm(0);
          }
        },
      }),
    ];
  }
}
