import {
  MidiCommand,
  MidiVendorId,
  bufferToMidiCommand,
} from "@loop-conductor/common";
import { logError, logInfo } from "./Log";

type Observer = (tasks: MidiCommand) => void;

export class MidiManager {
  private buffer: number[] = [];

  private observers: Observer[] = [];

  public observe(observer: Observer): () => void {
    const i = this.observers.length;
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.splice(i, 1);
    };
  }

  public onSysexByteReceived(byte: number) {
    if (byte === 240) {
      this.buffer = [];
      return;
    } else if (byte === 247) {
      this.onSysexReceived(this.buffer);
      return;
    }

    this.buffer.push(byte);
  }

  private hasValidHeader(buffer: number[]) {
    if (
      buffer[0] === MidiVendorId[0] &&
      buffer[1] === MidiVendorId[1] &&
      buffer[2] === MidiVendorId[2]
    ) {
      return true;
    }

    return false;
  }

  private onSysexReceived(buffer: number[]) {
    if (!this.hasValidHeader(buffer)) {
      logError("Invalid sysex header", buffer);
      return;
    }
    const data = buffer.slice(3);
    const command = bufferToMidiCommand(data);

    logInfo("Received command", command);
    this.observers.forEach((observer) => observer(command));
  }
}
