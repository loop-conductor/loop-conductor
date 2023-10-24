import { getLive, getTaskManager } from "../Globals";
import {
  barsToTicks,
  beatsToTime,
  offsetTime,
  roundToNextBar,
  ticksToTime,
} from "../Time";
import {
  BaseAction,
  Clip,
  Duration,
  Path,
  Task,
  TaskCallback,
  Time,
} from "../Types";

/**
 * This is the base class for all actions implementation.
 *
 * It provides some common methods and properties that are used by all actions:
 * - Getting the list of tasks that compose the action
 * - Getting the duration of the action
 * - Validating and patching the action definition
 */
export abstract class ActionImpl<Type extends BaseAction> {
  public abstract validateAndPatch(): void;

  protected action: Type;
  protected path: Path;
  protected sequenceId: number;

  public constructor(args: { action: Type; path: Path; sequenceId: number }) {
    const { action, path, sequenceId } = args;
    this.sequenceId = sequenceId;
    this.action = action;
    this.path = path;
    // Validate the action
    this.validateAndPatch();
  }

  /**
   * Return the list of tasks that compose the action.
   */
  public abstract getTasks(): Task[];

  /**
   * Return the duration in ticks of the action.
   */
  public abstract getDuration(): number;

  /**
   * Get the list of clips managed by the action.
   * Or null if this action do not manage any clip.
   */
  public abstract getManagedClips(): Clip | Clip[] | null;

  /**
   * Since the "at" property of an action
   * @param lastTicks
   * @returns
   */
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

  /**
   * Return a time matching the start of the next bar plus a given offset (at) .
   * @param args
   * @returns
   */
  protected getNextBarTime(args: { at: number }): Time {
    // This safety offset is used to make sure that the task is scheduled
    // "a bit" before the next bat tick, to leave some room for Live to process the task.
    const safetyOffset: Duration = "-16n";

    const { at } = args;
    const tSig = getLive().getCurrentTimeSignature();

    // Compute a timestamp matching the start of the next bar
    const nextBarTime = roundToNextBar(
      beatsToTime(getLive().getCurrentBeat(), tSig)
    );

    // Then We offset this time a bit, to leave some room for Live to process the task
    return offsetTime(
      // First shift timestamp representing the start of the next "at" bar.
      offsetTime(nextBarTime, barsToTicks(at, tSig), tSig),
      safetyOffset,
      tSig
    );
  }
}
