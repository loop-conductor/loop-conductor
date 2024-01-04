import { Conductor } from "@loop-conductor/common";
import { produce } from "immer";
import { useCallback, useMemo } from "react";
import { Storage } from "./Types";

export function useConductorFromStorage(
  storage: Storage,
  setStorage: (storage: Storage) => void
): [Conductor | undefined, (conductor: Conductor) => void] {
  const conductor = useMemo(() => {
    return storage.conductors.find(
      (conductor) => conductor.id === storage.loadedConductorId
    );
  }, [storage]);

  const setConductor = useCallback(
    (conductor: Conductor) => {
      setStorage(
        produce(storage, (draft) => {
          const conductorIndex = draft.conductors.findIndex(
            (conductor) => conductor.id === storage.loadedConductorId
          );
          if (conductorIndex !== -1) {
            draft.conductors[conductorIndex] = conductor;
          }
        })
      );
    },
    [storage]
  );

  return [conductor, setConductor];
}
