import { useCallback, useMemo } from "react";
import {
  Action,
  ArmTrackAction,
  FireClipAction,
  FireSceneAction,
  MenuButton,
  MenuItem,
  MetronomeAction,
  OverdubLoopAction,
  RecordLoopAction,
  StopClipAction,
  TempoAction,
  getUUID,
} from "../../Shared";

interface Props {
  onAddAction: (action: Action) => void;
}

function createDefaultAction(type: Action["type"]): Action {
  const map: Record<Action["type"], Action> = {
    armTrack: {
      id: getUUID(),
      trackName: 0,
      type: "armTrack",
      armed: 1,
      at: 0,
    } satisfies ArmTrackAction,
    fireClip: {
      id: getUUID(),
      trackName: 0,
      sceneName: 0,
      type: "fireClip",
      at: 0,
    } satisfies FireClipAction,
    fireScene: {
      id: getUUID(),
      sceneName: 0,
      type: "fireScene",
      at: 0,
    } satisfies FireSceneAction,
    metronome: {
      id: getUUID(),
      type: "metronome",
      enable: 1,
      at: 0,
    } satisfies MetronomeAction,
    overdubLoop: {
      id: getUUID(),
      trackName: 0,
      type: "overdubLoop",
      barCount: 1,
      sceneName: 0,
      at: 0,
    } satisfies OverdubLoopAction,
    recordLoop: {
      id: getUUID(),
      trackName: 0,
      type: "recordLoop",
      barCount: 1,
      sceneName: 0,
      at: 0,
    } satisfies RecordLoopAction,
    stopClip: {
      id: getUUID(),
      trackName: 0,
      sceneName: 0,
      type: "stopClip",
      at: 0,
    } satisfies StopClipAction,
    tempo: {
      id: getUUID(),
      type: "tempo",
      at: 0,
      tempo: 120,
    } satisfies TempoAction,
  };

  return map[type];
}

export function AddActionMenu({ onAddAction }: Props) {
  const onAdd = useCallback(
    (type: Action["type"]) => {
      const action = createDefaultAction(type);
      onAddAction(action);
      if (document.activeElement instanceof HTMLElement)
        document.activeElement?.blur();
    },
    [onAddAction]
  );

  const items: MenuItem[] = useMemo(() => {
    return [
      {
        label: "Arm track",
        onClick: () => onAdd("armTrack"),
      },
      {
        label: "Fire clip",
        onClick: () => onAdd("fireClip"),
      },
      {
        label: "Fire scene",
        onClick: () => onAdd("fireScene"),
      },
      {
        label: "Metronome",
        onClick: () => onAdd("metronome"),
      },
      {
        label: "Overdub loop",
        onClick: () => onAdd("overdubLoop"),
      },
      {
        label: "Record loop",
        onClick: () => onAdd("recordLoop"),
      },
      {
        label: "Stop clip",
        onClick: () => onAdd("stopClip"),
      },
      {
        label: "Tempo",
        onClick: () => onAdd("tempo"),
      },
    ];
  }, [onAdd]);

  return <MenuButton items={items} iconName="add" />;
}
