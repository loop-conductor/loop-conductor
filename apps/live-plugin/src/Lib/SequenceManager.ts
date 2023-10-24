import { ActionManager } from "./ActionManager";
import { getIdGenerator, getTaskManager } from "./Globals";
import { Clip, Path, Sequence } from "./Types";
import { createValidationError, isArray, isValidPadId } from "./Utils";

export class SequenceManager {
  private sequence: Sequence;
  private id: number;
  private actionManagers: ActionManager[] = [];

  constructor(sequence: Sequence, path: Path) {
    this.sequence = sequence;
    this.id = getIdGenerator().id();
    if (!sequence.actions) {
      throw createValidationError("No actions defined in sequence", [
        ...path,
        "actions",
      ]);
    }
    if (!isArray(sequence.actions)) {
      throw createValidationError("Actions is not an array", [
        ...path,
        "actions",
      ]);
    }
    if (!isValidPadId(sequence.padId)) {
      throw createValidationError("Invalid Pad Id", [...path, "padId"]);
    }

    this.actionManagers = sequence.actions.map(
      (action, i) =>
        new ActionManager({
          action,
          sequenceId: this.id,
          path: [...path, "actions", i],
        })
    );

    this.resolveRelativeTimes();
  }

  public getId(): number {
    return this.id;
  }

  public getManagedClips(): Clip[] {
    const clips: Clip[] = [];
    this.actionManagers.forEach((actionManager) => {
      const actionClips = actionManager.getManagedClips();
      if (actionClips) {
        clips.push(...actionClips);
      }
    });
    return clips;
  }

  public getName(): string | undefined {
    return this.sequence.name;
  }

  public getPadId(): number {
    return this.sequence.padId;
  }

  private resolveRelativeTimes(): void {
    let lastPos: number = 0;

    this.actionManagers.forEach((actionManager) => {
      lastPos = actionManager.resolveRelativeTimes(lastPos);
    });
  }

  public trigger(): void {
    // Be sure to clear out all ongoing tasks
    getTaskManager().reset();
    // Execute all the record loops actions
    this.actionManagers.map((action) => action.trigger());
  }
}
