import { Action, BaseAction } from "@loop-conductor/common";
import { FC } from "react";
import { IconButton, Label } from "../../Shared";
import { ArmTrackActionView } from "./ArmTrackActionView";
import { FireClipActionView } from "./FireClipActionView";
import { FireSceneActionView } from "./FireSceneActionView";
import { MemoActionView } from "./MemoActionView";
import { MetronomeActionView } from "./MetronomeActionView";
import { OverdubLoopActionView } from "./OverdubLoopActionView";
import { RecordLoopActionView } from "./RecordLoopActionView";
import { StopClipActionView } from "./StopClipActionView";
import { TempoActionView } from "./TempoActionView";
import { WaitActionView } from "./WaitActionView";

interface ActionProps {
  action: BaseAction;
  onChange: (action: Action) => void;
}

interface Props extends ActionProps {
  onRemoved: (id: string) => void;
  onMove: (id: string, dir: "left" | "right") => void;
  index: number;
  count: number;
}

export function ActionView({
  action,
  onChange,
  onRemoved,
  index,
  count,
  onMove,
}: Props) {
  const ActionMap: Record<Action["type"], FC<ActionProps>> = {
    armTrack: ArmTrackActionView as FC<ActionProps>,
    fireClip: FireClipActionView as FC<ActionProps>,
    fireScene: FireSceneActionView as FC<ActionProps>,
    metronome: MetronomeActionView as FC<ActionProps>,
    overdubLoop: OverdubLoopActionView as FC<ActionProps>,
    recordLoop: RecordLoopActionView as FC<ActionProps>,
    stopClip: StopClipActionView as FC<ActionProps>,
    tempo: TempoActionView as FC<ActionProps>,
    wait: WaitActionView as FC<ActionProps>,
    memo: MemoActionView as FC<ActionProps>,
  };

  const ActionComponent = ActionMap[
    action.type as Action["type"]
  ] as FC<ActionProps>;

  return (
    <div className="bg-zinc-200 rounded min-w-[15rem] shadow-lg border border-zinc-500 flex-shrink-0 flex flex-col">
      <div className="p-2 font-medium text-zinc-600">{action.type}</div>
      <div className="p-2 border-b border-t border-zinc-400 flex-grow">
        <ActionComponent action={action} onChange={onChange} />
      </div>
      <div className="flex gap-4 justify-between p-2 items-center">
        <div className="flex gap-2 items-center">
          <Label text={`Start bar ${action.startBar}`} className="text-xs" />
        </div>
        <div className="flex gap-2">
          <IconButton
            iconName="delete"
            onClick={() => onRemoved(action.id)}
            destructive
          />
          <div className="flex gap-1">
            <IconButton
              iconName="west"
              onClick={() => onMove(action.id, "left")}
              disabled={index <= 0}
            />
            <IconButton
              iconName="east"
              onClick={() => onMove(action.id, "right")}
              disabled={index >= count - 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
