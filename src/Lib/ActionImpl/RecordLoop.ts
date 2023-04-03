import { getLive } from "../Globals";
import { barsToBeats, barsToTicks, offsetTime } from "../Time";
import { Clip, RecordLoopAction, Task } from "../Types";
import { createValidationError, isValidBarCount } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class RecordLoopActionImpl extends ActionImpl<RecordLoopAction> {
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
    const stopTime = offsetTime(
      startTime,
      barsToTicks(action.barCount, tSig),
      tSig
    );
    const recordLength = barsToBeats(action.barCount, tSig);
    const unarmOnStop = action.unarmOnStop ?? 1;

    return [
      // Start recording task
      this.createTask({
        timepoint: startTime,
        callback: () => {
          var track = getLive().getTrack(trackIndex);
          track.arm(1);

          var clipSlot = track.getClipSlot(sceneIndex);
          if (clipSlot.hasClip()) {
            clipSlot.deleteClip();
          }
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
