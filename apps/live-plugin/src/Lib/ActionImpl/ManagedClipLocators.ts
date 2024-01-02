import {
  Action,
  ActionMap,
  Clip,
  OverdubLoopAction,
  RecordLoopAction,
} from "@loop-conductor/common";

type ManagedClipLocators = {
  [key in Action["type"]]: undefined | ((action: ActionMap[key]) => Clip[]);
};

export const managedClipLocators: ManagedClipLocators = {
  armTrack: undefined,
  fireClip: undefined,
  stopClip: undefined,
  tempo: undefined,
  metronome: undefined,
  fireScene: undefined,
  wait: undefined,
  memo: undefined,
  overdubLoop: (action: OverdubLoopAction) => {
    return [
      {
        sceneName: action.sceneName,
        trackName: action.trackName,
      },
    ];
  },
  recordLoop: (action: RecordLoopAction) => {
    return [
      {
        sceneName: action.sceneName,
        trackName: action.trackName,
      },
    ];
  },
};
