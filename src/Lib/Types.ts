/**
 * General types used throughout the library.
 */

export const PadCount = 12;

export type TrackName = string | number;
export type SceneName = string | number;

export interface ValidationError {
  path: Path;
  err: string;
}

export type Path = (string | number)[];

export interface Clip {
  trackName: TrackName;
  sceneName: SceneName;
}

/**
 * Time types
 */

export interface Time {
  bar: number;
  beat: number;
  unit: number;
}

export type Duration =
  | number
  | "1nd"
  | "1n"
  | "1nt"
  | "2nd"
  | "2n"
  | "2nt"
  | "4nd"
  | "4n"
  | "4nt"
  | "8nd"
  | "8n"
  | "8nt"
  | "16nd"
  | "16n"
  | "16nt"
  | "32nd"
  | "32n"
  | "32nt"
  | "64nd"
  | "64n"
  | "128n"
  | "-1nd"
  | "-1n"
  | "-1nt"
  | "-2nd"
  | "-2n"
  | "-2nt"
  | "-4nd"
  | "-4n"
  | "-4nt"
  | "-8nd"
  | "-8n"
  | "-8nt"
  | "-16nd"
  | "-16n"
  | "-16nt"
  | "-32nd"
  | "-32n"
  | "-32nt"
  | "-64nd"
  | "-64n"
  | "-128n";

export const InvalidTime = {
  bar: -1,
  beat: -1,
  unit: -1,
};

export type TimeBeatValue = 1 | 2 | 4 | 8 | 16;
export interface TimeSignature {
  beatsPerBar: number;
  beatValue: TimeBeatValue;
}

/**
 * Tasks types
 */

export interface Task {
  id: number;
  timepoint: Time;
  callback: TaskCallback;
  sequenceId: number;
}

export type TaskCallback = () => void;

/**
 * Conductor types
 */

export type ActionConfig = Record<string, unknown>;

export interface BaseAction<Name extends string> {
  type: Name;
  // When this action will be triggered.
  // In Bars count relative to the action group start time
  at?: number;
}

export interface FireClipAction extends BaseAction<"fireClip"> {
  sceneName: SceneName;
  trackName: TrackName;
}

export interface ArmTrackAction extends BaseAction<"armTrack"> {
  trackName: TrackName;
  // Default to true
  armed?: 0 | 1;
}

export interface FireSceneAction extends BaseAction<"fireScene"> {
  sceneName: SceneName;
}

export interface MetronomeAction extends BaseAction<"metronome"> {
  enable: 0 | 1;
}
export interface TempoAction extends BaseAction<"tempo"> {
  tempo: number;
}

export interface RecordLoopAction extends BaseAction<"recordLoop"> {
  barCount: number;
  trackName: TrackName;
  sceneName: SceneName;
  // Wether the track should be un armed when the loop is done recording
  unarmOnStop?: 0 | 1;
}

export interface OverdubLoopAction extends BaseAction<"overdubLoop"> {
  barCount: number;
  trackName: TrackName;
  sceneName: SceneName;
  // Wether the track should be un armed when the loop is done recording
  unarmOnStop?: 0 | 1;
}

export interface StopClipAction extends BaseAction<"stopClip"> {
  sceneName: SceneName;
  trackName: TrackName;
}

export type Action =
  | RecordLoopAction
  | FireClipAction
  | StopClipAction
  | FireSceneAction
  | MetronomeAction
  | OverdubLoopAction
  | TempoAction
  | ArmTrackAction;

export interface Sequence {
  // An optional name display in the pad matrix
  name?: string;
  // An id to identify the sequence in the pad matrix
  // If not provided, the padId will be the index of the sequence in the array of sequences
  padId: number;
  actions: Action[];
}

export interface Conductor {
  sequences: Sequence[];
}
