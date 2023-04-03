import { getLive, getTaskManager } from "../Globals";
import {
  barsToTicks,
  beatsToTime,
  offsetTime,
  roundToNextBar,
  ticksToTime,
} from "../Time";
import {
  Action,
  Clip,
  Duration,
  Path,
  Task,
  TaskCallback,
  Time,
} from "../Types";

export abstract class ActionImpl<Type extends Action> {
  public abstract validate(): void;

  protected action: Type;
  protected path: Path;
  protected sequenceId: number;

  public constructor(args: { action: Type; path: Path; sequenceId: number }) {
    const { action, path, sequenceId } = args;
    this.sequenceId = sequenceId;
    this.action = action;
    this.path = path;
    this.validate();
  }

  public abstract getTasks(): Task[];

  public abstract getDuration(): number;

  public abstract getManagedClips(): Clip | Clip[] | null;

  public resolveRelativeTimes(lastTicks: number): number {
    const tSig = getLive().getCurrentTimeSignature();
    if (this.action.at === undefined) {
      this.action.at = ticksToTime(lastTicks, tSig).bar - 1;
    }
    return barsToTicks(this.action.at, tSig) + this.getDuration();
  }

  public getType(): Type["type"] {
    return this.action.type;
  }

  public getAction(): Type {
    return this.action;
  }

  protected createTask(args: {
    timepoint: Time;
    callback: TaskCallback;
  }): Task {
    return getTaskManager().createTask({
      ...args,
      sequenceId: this.sequenceId,
    });
  }

  protected getNextBarTime(args: { at: number; offset?: Duration }): Time {
    const { at, offset = "-16n" } = args;
    const tSig = getLive().getCurrentTimeSignature();
    const nextBarTime = roundToNextBar(
      beatsToTime(getLive().getCurrentBeat(), tSig)
    );

    return offsetTime(
      offsetTime(nextBarTime, barsToTicks(at, tSig), tSig),
      offset,
      tSig
    );
  }
}
