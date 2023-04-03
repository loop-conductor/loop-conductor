import { ActionImpl } from "./ActionImpl/ActionImpl";
import { ArmTrackActionImpl } from "./ActionImpl/ArmTrack";
import { FireClipActionImpl } from "./ActionImpl/FireClip";
import { FireSceneActionImpl } from "./ActionImpl/FireScene";
import { MetronomeActionImpl } from "./ActionImpl/Metronome";
import { OverdubLoopActionImpl } from "./ActionImpl/OverdubLoop";
import { RecordLoopActionImpl } from "./ActionImpl/RecordLoop";
import { StopClipActionImpl } from "./ActionImpl/StopClip";
import { TempoActionImpl } from "./ActionImpl/Tempo";
import { getTaskManager } from "./Globals";
import { logInfo } from "./Log";
import { Action, Clip, Path, Task } from "./Types";
import { createValidationError, normalizeToArray } from "./Utils";

const actionImplCtrs = {
  recordLoop: RecordLoopActionImpl,
  fireScene: FireSceneActionImpl,
  fireClip: FireClipActionImpl,
  stopClip: StopClipActionImpl,
  metronome: MetronomeActionImpl,
  armTrack: ArmTrackActionImpl,
  overdubLoop: OverdubLoopActionImpl,
  tempo: TempoActionImpl,
};

export class ActionManager {
  private impl: ActionImpl<Action>;
  private sequenceId: number;

  constructor(args: { action: Action; sequenceId: number; path: Path }) {
    const { action, sequenceId, path } = args;
    this.sequenceId = sequenceId;

    const ActionImplCtr = actionImplCtrs[action.type];

    if (!ActionImplCtr) {
      throw createValidationError(`Invalid action type (${action.type})`, [
        ...path,
        "type",
      ]);
    }

    this.impl = new ActionImplCtr({
      action: action,
      path,
      sequenceId: this.sequenceId,
    } as any);
  }

  public getManagedClips(): Clip[] {
    const clips = this.impl.getManagedClips();
    if (!clips) {
      return [];
    }
    return normalizeToArray(clips);
  }

  public trigger(): Task[] {
    const tasks = this.impl.getTasks();

    tasks.forEach((task) => {
      getTaskManager().scheduleTask({ task });
    });

    logInfo(`Action ${this.impl.getType()} scheduled`, this.impl.getAction());
    return tasks;
  }

  public resolveRelativeTimes(lastTicks: number): number {
    return this.impl.resolveRelativeTimes(lastTicks);
  }
}
