import {
  Action,
  ActionMap,
  ArmTrackAction,
  Conductor,
  FireClipAction,
  FireSceneAction,
  MemoAction,
  MetronomeAction,
  OverdubLoopAction,
  RecordLoopAction,
  Sequence,
  StopClipAction,
  TempoAction,
  ValidationError,
  WaitAction,
  isValidBarCount,
} from "@loop-conductor/common";
import { getLive } from "../Globals";

type Validators = {
  [key in Action["type"]]: (
    action: ActionMap[key],
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => void;
};

export const validators: Validators = {
  armTrack: (
    action: ArmTrackAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (!getLive().isValidTrackName(action.trackName)) {
      throw {
        Error: `Invalid track name: ${action.trackName}`,
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  fireClip: (
    action: FireClipAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw {
        Error: "Invalid scene name",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
    if (!getLive().isValidTrackName(action.trackName)) {
      throw {
        Error: `Invalid track name: ${action.trackName}`,
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  stopClip: (
    action: StopClipAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw {
        Error: "Invalid scene name",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
    if (!getLive().isValidTrackName(action.trackName)) {
      throw {
        Error: `Invalid track name: ${action.trackName}`,
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  overdubLoop: (
    action: OverdubLoopAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw {
        Error: "Invalid scene name",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
    if (!getLive().isValidTrackName(action.trackName)) {
      throw {
        Error: `Invalid track name: ${action.trackName}`,
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  tempo: (
    action: TempoAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (typeof action.tempo !== "number") {
      throw {
        Error: "Invalid tempo value",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  recordLoop: (
    action: RecordLoopAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw {
        Error: "Invalid scene name",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
    if (!getLive().isValidTrackName(action.trackName)) {
      throw {
        Error: `Invalid track name: ${action.trackName}`,
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
    if (!isValidBarCount(action.barCount)) {
      throw {
        Error: "Invalid bar count",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  metronome: (
    action: MetronomeAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (typeof action.enable !== "number") {
      throw {
        Error: "Invalid enabled value",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  wait: (
    action: WaitAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (typeof action.barCount !== "number") {
      throw {
        Error: "Invalid bar count",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  memo: (
    action: MemoAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (typeof action.memo !== "string") {
      throw {
        Error: "Memo value is not a string",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
  fireScene: (
    action: FireSceneAction,
    conductor: Conductor,
    sequence: Sequence,
    actionIndex: number
  ) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw {
        Error: "Invalid scene name",
        Conductor: conductor.name,
        Sequence: sequence.name,
        ActionIndex: actionIndex,
      } satisfies ValidationError;
    }
  },
};
