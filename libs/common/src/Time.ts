import { Duration, InvalidTime, Time, TimeSignature } from "./Types";

export function durationToTicks(note: Duration): number {
  if (typeof note === "number") return note;
  switch (note) {
    case "1nd":
      return 2880;
    case "1n":
      return 1920;
    case "1nt":
      return 1280;
    case "2nd":
      return 2440;
    case "2n":
      return 960;
    case "2nt":
      return 640;
    case "4nd":
      return 720;
    case "4n":
      return 480;
    case "4nt":
      return 320;
    case "8nd":
      return 260;
    case "8n":
      return 240;
    case "8nt":
      return 160;
    case "16nd":
      return 180;
    case "16n":
      return 120;
    case "16nt":
      return 80;
    case "32nd":
      return 90;
    case "32n":
      return 60;
    case "32nt":
      return 40;
    case "64nd":
      return 45;
    case "64n":
      return 30;
    case "128n":
      return 15;
    case "-1nd":
      return -2880;
    case "-1n":
      return -1920;
    case "-1nt":
      return -1280;
    case "-2nd":
      return -2440;
    case "-2n":
      return -960;
    case "-2nt":
      return -640;
    case "-4nd":
      return -720;
    case "-4n":
      return -480;
    case "-4nt":
      return -320;
    case "-8nd":
      return -260;
    case "-8n":
      return -240;
    case "-8nt":
      return -160;
    case "-16nd":
      return -180;
    case "-16n":
      return -120;
    case "-16nt":
      return -80;
    case "-32nd":
      return -90;
    case "-32n":
      return -60;
    case "-32nt":
      return -40;
    case "-64nd":
      return -45;
    case "-64n":
      return -30;
    case "-128n":
      return -15;
  }

  return -1;
}

export function addDurations(a: Duration, b: Duration): Duration {
  return durationToTicks(a) + durationToTicks(b);
}

export function isInvalidTime(time: Time, tSig: TimeSignature): boolean {
  if (time.unit <= 0 || time.unit > ticksPerBeat(tSig)) {
    return true;
  }
  if (time.beat <= 0 || time.beat > tSig.beatsPerBar) {
    return true;
  }
  if (time.bar <= 0) {
    return true;
  }

  return false;
}

export function barsToTicks(barCount: number, tSig: TimeSignature): number {
  return barCount * tSig.beatsPerBar * ticksPerBeat(tSig);
}

export function barsToBeats(barCount: number, tSig: TimeSignature): number {
  return barCount * tSig.beatsPerBar;
}

export function beatsToTicks(beatCount: number, tSig: TimeSignature): number {
  return beatCount * ticksPerBeat(tSig);
}

export function parseTime(time: string | number): Time {
  if (typeof time === "number") {
    return {
      bar: time,
      beat: 1,
      unit: 1,
    };
  }
  const s = time.split(".");
  return {
    bar: parseInt(s[0]),
    beat: parseInt(s[1]),
    unit: parseInt(s[2]),
  };
}
export function stringifyTime(time: Time): string {
  return `${time.bar}.${time.beat}.${time.unit}`;
}

export function ticksPerBeat(tSig: TimeSignature): number {
  const map = {
    1: 480 * 4,
    2: 480 * 2,
    4: 480,
    8: 480 / 2,
    16: 480 / 4,
  };

  return map[tSig.beatValue];
}

export function timeToTicks(time: Time, tSig: TimeSignature): number {
  const tpb = ticksPerBeat(tSig);
  const bpb = tSig.beatsPerBar;

  if (isInvalidTime(time, tSig)) {
    return -1;
  }
  const offset = bpb * tpb + tpb + 1;

  return time.unit + time.beat * tpb + time.bar * (bpb * tpb) - offset;
}

export function ticksToTime(duration: number, tSig: TimeSignature): Time {
  const tpb = ticksPerBeat(tSig);
  const bpb = tSig.beatsPerBar;

  // 2401
  const offset = bpb * tpb + tpb + 1;
  let remainingDuration = duration + offset;
  let unit = remainingDuration % tpb;
  if (unit === 0) {
    unit = tpb;
  }

  remainingDuration = remainingDuration - unit;
  let beat = Math.floor(remainingDuration / tpb) % bpb;
  if (beat === 0) {
    beat = bpb;
  }

  remainingDuration = remainingDuration - beat * tpb;
  let bar = Math.floor(remainingDuration / (bpb * tpb));

  const t: Time = {
    bar,
    beat,
    unit,
  };
  if (isInvalidTime(t, tSig)) {
    return InvalidTime;
  }
  return t;
}

export function beatsToTime(beats: number, tSig: TimeSignature): Time {
  const tpb = ticksPerBeat(tSig);
  return ticksToTime(beats * tpb, tSig);
}

export function offsetTime(
  a: Time,
  duration: Duration,
  tSig: TimeSignature
): Time {
  return ticksToTime(timeToTicks(a, tSig) + durationToTicks(duration), tSig);
}

export function roundToNextBar(time: Time): Time {
  return {
    bar: time.bar + 1,
    beat: 1,
    unit: 1,
  };
}

export function isTime(time: unknown): time is Time {
  const castedTime = time as Time;

  return (
    typeof castedTime.bar === "number" &&
    typeof castedTime.beat === "number" &&
    typeof castedTime.unit === "number"
  );
}

/**
 * Return a time matching the start of the next bar plus a given offset (at) .
 * @param args
 * @returns
 */
export function getNextBarTime(args: {
  at: number;
  tSig: TimeSignature;
  currentBeat: number;
}): Time {
  // This safety offset is used to make sure that the task is scheduled
  // "a bit" before the next bat tick, to leave some room for Live to process the task.
  const safetyOffset: Duration = "-16n";

  const { at, currentBeat, tSig } = args;

  // Compute a timestamp matching the start of the next bar
  const nextBarTime = roundToNextBar(beatsToTime(currentBeat, tSig));

  // Then We offset this time a bit, to leave some room for Live to process the task
  return offsetTime(
    // First shift timestamp representing the start of the next "at" bar.
    offsetTime(nextBarTime, barsToTicks(at, tSig), tSig),
    safetyOffset,
    tSig
  );
}
