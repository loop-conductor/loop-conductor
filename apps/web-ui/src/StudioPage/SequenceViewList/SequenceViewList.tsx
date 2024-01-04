import { Sequence } from "@loop-conductor/common";
import { produce } from "immer";
import { useCallback } from "react";
import {
  Button,
  getUUID,
  useAvailablePadIds,
  useConductor,
} from "../../Shared";
import { SequenceView } from "../SequenceView";
interface Props {
  sequences: Sequence[];
  onSequenceListChange: (sequences: Sequence[]) => void;
}

export function SequenceViewList({ sequences, onSequenceListChange }: Props) {
  const availablePadIds = useAvailablePadIds(useConductor());
  const handleOnSequenceChange = useCallback(
    (sequence: Sequence) => {
      onSequenceListChange(
        produce(sequences, (draft) => {
          const index = draft.findIndex((s) => s.id === sequence.id);
          draft[index] = sequence;
          return draft;
        })
      );
    },
    [sequences, onSequenceListChange]
  );

  const handleAddSequence = useCallback(() => {
    onSequenceListChange(
      produce(sequences, (draft) => {
        draft.push({
          id: getUUID(),
          padId: availablePadIds[0],
          name: "New sequence",
          actions: [],
        });
      })
    );
  }, [sequences, onSequenceListChange]);

  const handleOnRemoveSequence = useCallback(
    (id: string) => {
      onSequenceListChange(
        produce(sequences, (draft) => {
          return draft.filter((action, i) => action.id !== id);
        })
      );
    },
    [sequences, onSequenceListChange]
  );

  const handleOnMoveSequence = useCallback(
    (id: string, dir: "up" | "down") => {
      onSequenceListChange(
        produce(sequences, (draft) => {
          const index = draft.findIndex((action, i) => action.id === id);
          if (dir === "down" && index < draft.length - 1) {
            const action = draft[index];
            draft[index] = draft[index + 1];
            draft[index + 1] = action;
          } else if (dir === "up" && index > 0) {
            const action = draft[index];
            draft[index] = draft[index - 1];
            draft[index - 1] = action;
          }
        })
      );
    },
    [sequences, onSequenceListChange]
  );

  return (
    <div className="p-4 flex flex-col gap-4 items-start overflow-y-auto h-full">
      {sequences.map((sequence, index) => (
        <SequenceView
          key={sequence.id}
          sequence={sequence}
          onChange={handleOnSequenceChange}
          onRemove={handleOnRemoveSequence}
          onMove={handleOnMoveSequence}
          index={index}
          count={sequences.length}
        />
      ))}
      <div>
        <Button
          label="Add sequence"
          leadingIconName="add"
          onClick={handleAddSequence}
          disabled={!availablePadIds.length}
        />
      </div>
    </div>
  );
}
