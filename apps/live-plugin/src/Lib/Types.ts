/**
 * General types used throughout the library.
 */

export const PadCount = 12;

// Internally tracks are 0 Based, but for sake of clarity,
// they are defined in the Json as 1 based.
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

export interface BaseAction<Name extends string = string> {
  // A unique id to identify the action
  id: string;
  type: Name;
  /**
   * When this action will be triggered.
   * In Bars count relative to the sequence start time
   * If not provided, it will be adjusted to match the end of the previous action.
   * ( see resolveRelativeTimes )
   */
  at?: number;
}

export interface RecordLoopAction extends BaseAction<"recordLoop"> {
  barCount: number;
  trackName: TrackName;
  sceneName: SceneName;
  // Wether the track should be un armed when the loop is done recording
  unarmOnStop?: 0 | 1;
  // Wether ALL Others tracks should be un armed when the loop start recording
  unarmOthersOnStart?: 0 | 1;
}

export interface ArmTrackAction extends BaseAction<"armTrack"> {
  trackName: TrackName;
  // Default to true
  armed?: 0 | 1;
}

export interface FireClipAction extends BaseAction<"fireClip"> {
  sceneName: SceneName;
  trackName: TrackName;
}

export interface FireSceneAction extends BaseAction<"fireScene"> {
  sceneName: SceneName;
}

export interface MetronomeAction extends BaseAction<"metronome"> {
  enable: 0 | 1;
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

export interface TempoAction extends BaseAction<"tempo"> {
  tempo: number;
}

export type Action =
  | ArmTrackAction
  | FireClipAction
  | FireSceneAction
  | MetronomeAction
  | OverdubLoopAction
  | RecordLoopAction
  | StopClipAction
  | RecordLoopAction
  | StopClipAction
  | TempoAction;

export interface Sequence {
  // A unique id to identify the sequence
  id: string;
  // An optional name display in the pad matrix
  name?: string;
  // An id to identify the sequence in the pad matrix
  // Pad Id Are 1 based
  padId: number;
  actions: Action[];
}

export interface Conductor {
  id: string;
  name: string;
  sequences: Sequence[];
}
