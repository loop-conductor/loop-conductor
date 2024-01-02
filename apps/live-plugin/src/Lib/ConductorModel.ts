import {
  Clip,
  Conductor,
  Task,
  arrayFind,
  createValidationError,
  isArray,
  isValidPadId,
} from "@loop-conductor/common";
import { managedClipLocators, taskCreators, validators } from "./ActionImpl";
import { getLive, getTaskManager } from "./Globals";
import { logError } from "./Log";
/**
 * 
 
public resolveRelativeTimes(lastTicks: number): number {
    const tSig = getLive().getCurrentTimeSignature();
    if (this.action.at === undefined) {
      this.action.at = ticksToTime(lastTicks, tSig).bar - 1;
    }
    return (
      barsToTicks(this.action.at, tSig) + getActionDuration(this.action, tSig)
    );
  }


 * 
 */
export class ConductorModel {
  public readonly conductor: Conductor | null = null;

  public static parse(obj: string): null | ConductorModel {
    let conductor: Conductor | null = null;

    try {
      conductor = JSON.parse(obj) as Conductor;
    } catch (err) {
      throw createValidationError("Failed to parse file");
    }

    return new ConductorModel(conductor);
  }

  constructor(conductor: Conductor) {
    this.conductor = conductor;
    if (!conductor) {
      throw createValidationError("No conductor", []);
    }

    if (!conductor.sequences) {
      throw createValidationError("No sequences defined", ["sequences"]);
    }
    if (!isArray(conductor.sequences)) {
      throw createValidationError("Sequences is not an array", ["sequences"]);
    }

    // Validate each sequence
    this.conductor.sequences.forEach((sequence, sequenceIndex) => {
      if (!sequence.actions) {
        throw createValidationError("No actions defined in sequence", [
          "sequences",
          sequenceIndex,
          "actions",
        ]);
      }
      if (!isArray(sequence.actions)) {
        throw createValidationError("Actions is not an array", [
          "sequences",
          sequenceIndex,
          "actions",
        ]);
      }
      if (!isValidPadId(sequence.padId)) {
        throw createValidationError("Invalid Pad Id", [
          "sequences",
          sequenceIndex,
          "padId",
        ]);
      }

      sequence.actions.forEach((action, actionIndex) => {
        const validator = validators[action.type];
        if (validator) {
          validator(action as any, [
            "sequences",
            sequenceIndex,
            "actions",
            actionIndex,
          ]);
        }
      });
      if (!this.conductor) {
        return;
      }
      const dup = arrayFind(
        this.conductor.sequences,
        (seq2) => seq2.id !== sequence.id && seq2.padId === sequence.padId
      );

      if (dup) {
        throw createValidationError(
          `PadId ${sequence.padId} is used multiple times`,
          ["sequences", sequenceIndex, "padId"]
        );
      }

      // TODO: Validate each clip
    });
  }

  public getManagedClips(): Clip[] {
    const clips: Clip[] = [];
    this.conductor?.sequences.forEach((sequence) => {
      sequence.actions.forEach((action) => {
        const locator = managedClipLocators[action.type];
        if (locator) {
          const actionClips = locator(action as any);
          if (actionClips) {
            clips.push(...actionClips);
          }
        }
      });
    });

    return clips;
  }

  public triggerSequenceByPadId(padId: number): void {
    // Grab the sequence associated with this padId
    if (this.conductor === null) {
      logError("No conductor loaded");
      return;
    }

    const sequence =
      arrayFind(this.conductor.sequences, (s) => s.padId === padId) ?? null;
    if (sequence) {
      // Collect all the tasks for this sequence
      const tasks: Task[] = [];
      sequence.actions.forEach((action) => {
        const creator = taskCreators[action.type];
        if (creator) {
          const actionClips = creator(action as any, sequence.id);
          tasks.push(...actionClips);
        }
      });

      // Schelude the tasks
      getTaskManager().scheduleTask(tasks);
    } else {
      logError("No sequence found for padId: " + padId);
    }
  }

  /**
   * Remove all clips managed by this conductor from live
   */
  public deleteManagedClips(): void {
    const live = getLive();
    this?.getManagedClips().forEach((clip) => {
      live.getTrack(clip.trackName).getClipSlot(clip.sceneName).deleteClip();
    });
  }
}
