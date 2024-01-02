import { Action, Sequence, getActionBarCount } from "@loop-conductor/common";
import { produce } from "immer";
import { useCallback, useMemo } from "react";
import { FormElement, IconButton, Input, Label } from "../../Shared";
import { PadPicker } from "../../Shared/PadPicker";
import { ActionView } from "../ActionView";
import { AddActionMenu } from "./AddActionMenu";

interface Props {
  sequence: Sequence;
  onChange: (sequence: Sequence) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  index: number;
  count: number;
}

function recomputeStartBars(sequence: Sequence) {
  let startBar = 0;
  sequence.actions.forEach((action) => {
    const actionStartBar = startBar;
    action.startBar = actionStartBar;
    startBar += getActionBarCount(action);
    return actionStartBar;
  });

  return sequence;
}

export function SequenceView({
  sequence,
  onChange,
  onRemove,
  onMove,
  index,
  count,
}: Props) {
  const handleAddAction = useCallback(
    (action: Action) => {
      onChange(
        produce(sequence, (draft) => {
          draft.actions.push(action);
          return recomputeStartBars(draft);
        })
      );
    },
    [sequence, onChange]
  );

  const handleRemoveAction = useCallback(
    (id: string) => {
      onChange(
        produce(sequence, (draft) => {
          draft.actions = draft.actions.filter((action, i) => action.id !== id);
          return recomputeStartBars(draft);
        })
      );
    },
    [sequence, onChange]
  );

  const handleChangeAction = useCallback(
    (action: Action) => {
      onChange(
        produce(sequence, (draft) => {
          const index = draft.actions.findIndex((a, i) => a.id === action.id);
          draft.actions[index] = action;
          return recomputeStartBars(draft);
        })
      );
    },
    [sequence, onChange]
  );

  const handleMoveAction = useCallback(
    (id: string, dir: "left" | "right") => {
      onChange(
        produce(sequence, (draft) => {
          const index = draft.actions.findIndex(
            (action, i) => action.id === id
          );
          if (dir === "right" && index < draft.actions.length - 1) {
            const action = draft.actions[index];
            draft.actions[index] = draft.actions[index + 1];
            draft.actions[index + 1] = action;
          } else if (dir === "left" && index > 0) {
            const action = draft.actions[index];
            draft.actions[index] = draft.actions[index - 1];
            draft.actions[index - 1] = action;
          }

          return recomputeStartBars(draft);
        })
      );
    },
    [sequence, onChange]
  );

  const nextActionStartBar = useMemo(() => {
    return sequence.actions.reduce((acc, action) => {
      return acc + getActionBarCount(action);
    }, 0);
  }, [sequence]);

  return (
    <div className="flex rounded-lg shadow-lg max-w-full bg-cyan-600">
      <div className="flex flex-col gap-4 justify-between p-1 py-3 rounded-l-lg rounded-r shadow-lg bg-zinc-200 border border-zinc-500 m-2 mr-0">
        <div className="flex flex-col gap-1">
          <IconButton
            iconName="north"
            onClick={() => onMove(sequence.id, "up")}
            disabled={index <= 0}
          />
          <IconButton
            iconName="south"
            onClick={() => onMove(sequence.id, "down")}
            disabled={index >= count - 1}
          />
        </div>
        <div>
          <IconButton
            iconName="delete"
            onClick={() => onRemove(sequence.id)}
            destructive
          />
        </div>
      </div>
      <div className="bg-cyan-600 rounded-r-lg p-2 flex flex-col gap-2 overflow-x-auto">
        <div className="flex gap-4 bg-zinc-200 rounded rounded-tr-lg px-2 py-1 shadow-lg border border-zinc-500">
          <FormElement>
            <Label text="Name" />

            <Input
              type="text"
              placeholder="Type here"
              value={sequence.name}
              onChange={(name) => onChange({ ...sequence, name })}
            />
          </FormElement>
          <FormElement>
            <PadPicker
              value={sequence.padId}
              onChange={(padId) => onChange({ ...sequence, padId })}
            />
          </FormElement>
        </div>
        <div className="flex gap-2 items-stretch overflow-x-auto pb-2">
          {sequence.actions.map((action, index) => (
            <ActionView
              key={action.id}
              action={action}
              onChange={handleChangeAction}
              onMove={handleMoveAction}
              onRemoved={handleRemoveAction}
              index={index}
              count={sequence.actions.length}
            />
          ))}
          <div className="flex flex-col justify-center gap-4 bg-zinc-200 rounded px-1 py-2 shadow-lg border border-zinc-500">
            <AddActionMenu
              onAddAction={handleAddAction}
              startBar={nextActionStartBar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
