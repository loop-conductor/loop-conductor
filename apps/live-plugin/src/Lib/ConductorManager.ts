import { logError } from "./Log";
import { SequenceManager } from "./SequenceManager";
import { Clip, Conductor } from "./Types";
import { arrayFind, createValidationError, isArray } from "./Utils";

export class ConductorManager {
  private conductor: Conductor | null = null;

  private sequenceManagers: SequenceManager[] = [];

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

    this.sequenceManagers = conductor.sequences.map((sequence, i) => {
      return new SequenceManager(sequence, ["sequences", i]);
    });

    this.sequenceManagers.forEach((seq, index) => {
      const dup = arrayFind(
        this.sequenceManagers,
        (seq2) =>
          seq2.getId() !== seq.getId() && seq2.getPadId() === seq.getPadId()
      );

      if (dup) {
        throw createValidationError(
          `PadId ${seq.getPadId()} is used multiple times`,
          ["sequences", index, "padId"]
        );
      }
    });
  }

  public getManagedClips(): Clip[] {
    const clips: Clip[] = [];
    this.sequenceManagers.forEach((sequenceManagers) => {
      const actionClips = sequenceManagers.getManagedClips();
      if (actionClips) {
        clips.push(...actionClips);
      }
    });
    return clips;
  }

  public getSequenceManagers(): SequenceManager[] {
    return this.sequenceManagers;
  }

  public getConductor(): Conductor | null {
    return this.conductor;
  }

  public triggerSequenceByPadId(padId: number): void {
    const sequence = this.getSequenceByPadId(padId);
    if (sequence) {
      sequence.trigger();
    } else {
      logError("No sequence found for padId: " + padId);
    }
  }

  private getSequenceByPadId(padId: number): SequenceManager | null {
    if (this.conductor === null) {
      logError("No conductor loaded");
      return null;
    }

    return (
      arrayFind(this.sequenceManagers, (s) => s.getPadId() === padId) ?? null
    );
  }

  public static parse(obj: string): null | ConductorManager {
    let conductor: Conductor | null = null;

    try {
      conductor = JSON.parse(obj) as Conductor;
    } catch (err) {
      throw createValidationError("Failed to parse file");
    }

    return new ConductorManager(conductor);
  }
}
