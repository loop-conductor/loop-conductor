import { Conductor, Sequence } from "@loop-conductor/common";
import { produce } from "immer";
import { useCallback } from "react";
import { SequenceViewList } from "../SequenceViewList";

interface Props {
  conductor: Conductor;
  onConductorChange: (conductor: Conductor) => void;
}

export function ConductorView({ conductor, onConductorChange }: Props) {
  const handleOnSequenceListChange = useCallback(
    (sequences: Sequence[]) => {
      onConductorChange(
        produce(conductor, (draft) => {
          draft.sequences = sequences;
        })
      );
    },
    [conductor, onConductorChange]
  );

  return (
    <SequenceViewList
      sequences={conductor.sequences}
      onSequenceListChange={handleOnSequenceListChange}
    />
  );
}
