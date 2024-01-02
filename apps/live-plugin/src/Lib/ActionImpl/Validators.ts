import {
  Action,
  ActionMap,
  ArmTrackAction,
  FireClipAction,
  FireSceneAction,
  MemoAction,
  MetronomeAction,
  OverdubLoopAction,
  Path,
  RecordLoopAction,
  StopClipAction,
  TempoAction,
  WaitAction,
  createValidationError,
  isValidBarCount,
} from "@loop-conductor/common";
import { getLive } from "../Globals";

type Validators = {
  [key in Action["type"]]: (action: ActionMap[key], path: Path) => void;
};

export const validators: Validators = {
  armTrack: (action: ArmTrackAction, path: Path) => {
    if (!getLive().isValidTrack(action.trackName)) {
      throw createValidationError(`Invalid track name (${action.trackName})`, [
        ...path,
        "trackName",
      ]);
    }
  },
  fireClip: (action: FireClipAction, path: Path) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw createValidationError(`Invalid scene name`, [...path, "sceneName"]);
    }
    if (!getLive().isValidTrack(action.trackName)) {
      throw createValidationError(`Invalid track name`, [...path, "trackName"]);
    }
  },
  stopClip: (action: StopClipAction, path: Path) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw createValidationError("Invalid scene name", [...path, "sceneName"]);
    }
    if (!getLive().isValidTrack(action.trackName)) {
      throw createValidationError("Invalid track name", [...path, "trackName"]);
    }
  },
  overdubLoop: (action: OverdubLoopAction, path: Path) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw createValidationError(`Invalid scene name`, [...path, "sceneName"]);
    }
    if (!getLive().isValidTrack(action.trackName)) {
      throw createValidationError(`Invalid track name`, [...path, "trackName"]);
    }
  },
  tempo: (action: TempoAction, path: Path) => {
    if (typeof action.tempo !== "number") {
      throw createValidationError("Invalid tempo value", [...path, "enabled"]);
    }
  },
  recordLoop: (action: RecordLoopAction, path: Path) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw createValidationError(`Invalid scene name`, [...path, "sceneName"]);
    }
    if (!getLive().isValidTrack(action.trackName)) {
      throw createValidationError(`Invalid track name`, [...path, "trackName"]);
    }
    if (!isValidBarCount(action.barCount)) {
      throw createValidationError(`Invalid bar count (${action.barCount})`, [
        ...path,
        "barCount",
      ]);
    }
  },
  metronome: (action: MetronomeAction, path: Path) => {
    if (typeof action.enable !== "number") {
      throw createValidationError("Invalid enabled value", [...path, "enable"]);
    }
  },
  wait: (action: WaitAction, path: Path) => {
    if (typeof action.barCount !== "number") {
      throw createValidationError("Invalid bar count value", [
        ...path,
        "barCount",
      ]);
    }
  },
  memo: (action: MemoAction, path: Path) => {
    if (typeof action.memo !== "string") {
      throw createValidationError("Invalid memo value", [...path, "barCount"]);
    }
  },
  fireScene: (action: FireSceneAction, path: Path) => {
    if (!getLive().isValidSceneName(action.sceneName)) {
      throw createValidationError(`Invalid scene name`, [...path, "sceneName"]);
    }
  },
};
