import {
  Clip,
  Conductor,
  Task,
  ValidationError,
  arrayFind,
  isArray,
  isValidPadId,
} from "@loop-conductor/common";
import {
  managedClipLocators,
  taskCreators,
  validators,
} from "./ActionImpl/index";
import { getLive, getLogManager, getTaskManager } from "./Globals";
import { logError } from "./LogManager";

export class ConductorModel {
  public readonly conductor: Conductor | null = null;

  public static parse(obj: string): null | ConductorModel {
    let conductor: Conductor | null = null;

    try {
      conductor = JSON.parse(obj) as Conductor;
    } catch (err) {
      throw {
        Error: "Failed to parse conductor",
      } satisfies ValidationError;
    }

    return new ConductorModel(conductor);
  }

  constructor(conductor: Conductor) {
    this.conductor = conductor;

    if (!conductor.sequences) {
      throw {
        Error: "No sequences defined",
        Conductor: conductor.name,
      } satisfies ValidationError;
    }
    if (!isArray(conductor.sequences)) {
      throw {
        Error: "Sequence is not an array",
        Conductor: conductor.name,
      } satisfies ValidationError;
    }

    // Validate each sequence
    this.conductor.sequences.forEach((sequence, sequenceIndex) => {
      if (!sequence.actions) {
        throw {
          Error: "No actions defined in sequence",
          Conductor: conductor.name,
          Sequence: sequence.name,
        } satisfies ValidationError;
      }
      if (!isArray(sequence.actions)) {
        throw {
          Error: "Actions is not an array",
          Conductor: conductor.name,
          Sequence: sequence.name,
        } satisfies ValidationError;
      }
      if (!isValidPadId(sequence.padId)) {
        throw {
          Error: "Invalid pad id",
          Conductor: conductor.name,
          Sequence: sequence.name,
        } satisfies ValidationError;
      }

      sequence.actions.forEach((action, actionIndex) => {
        const validator = validators[action.type];
        if (validator) {
          validator(action as any, conductor, sequence, actionIndex);
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
        throw {
          Error: `PadId ${sequence.padId} is used multiple times`,
          Conductor: conductor.name,
          Sequence: sequence.name,
        } satisfies ValidationError;
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

      getLogManager().logInfo({
        Action: `Starting sequence: ${sequence.name}`,
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
