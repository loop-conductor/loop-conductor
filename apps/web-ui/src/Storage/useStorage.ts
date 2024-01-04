import { useState } from "react";
import { Storage } from "./Types";

export function useStorage(): [Storage, (storage: Storage) => void] {
  const [storage, setStorage] = useState<Storage>(() => {
    const storageAsString = localStorage.getItem("storage");
    if (storageAsString) {
      return JSON.parse(storageAsString);
    }
    return {
      conductors: [],
      loadedConductorId: undefined,
      midiOutputName: undefined,
    } satisfies Storage;
  });

  return [storage, setStorage];
}
