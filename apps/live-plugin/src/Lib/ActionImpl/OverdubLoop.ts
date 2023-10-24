import { getLive } from "../Globals";
import { barsToBeats, barsToTicks, offsetTime } from "../Time";
import { Clip, OverdubLoopAction, Task } from "../Types";
import { createValidationError, patchSceneOrTrackName } from "../Utils";
import { ActionImpl } from "./ActionImpl";

export class OverdubLoopActionImpl extends ActionImpl<OverdubLoopAction> {
  public validateAndPatch() {
    this.action.trackName = patchSceneOrTrackName(this.action.trackName);
    this.action.sceneName = patchSceneOrTrackName(this.action.sceneName);

    const { action, path } = this;

    if (!getLive().isValidScene(action.sceneName)) {
      throw createValidationError(`Invalid scene name`, [...path, "sceneName"]);
    }
    if (!getLive().isValidTrack(action.trackName)) {
      throw createValidationError(`Invalid track name`, [...path, "trackName"]);
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
          const track = getLive().getTrack(trackIndex);
          const clipSlot = track.getClipSlot(sceneIndex);
          const isPlaying = clipSlot.getClip()?.isPlaying();
          if (!isPlaying) {
            return;
          }
          getLive().setSessionRecord(1);
          track.arm(1);
        },
      }),
      // Stop recording task
      this.createTask({
        timepoint: stopTime,
        callback: () => {
          const track = getLive().getTrack(trackIndex);
          const clipSlot = track.getClipSlot(sceneIndex);
          const isPlaying = clipSlot.getClip()?.isPlaying();
          if (!isPlaying) {
            return;
          }
          getLive().setSessionRecord(0);
          if (unarmOnStop) {
            getLive().getTrack(trackIndex).arm(0);
          }
        },
      }),
    ];
  }
}
