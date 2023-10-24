import { useState } from "react";
import { Storage } from "./Types";
import { useSyncStorage } from "./useSyncStorage";

export function useStorageState(): [Storage, (storage: Storage) => void] {
  const [storage, setStorage] = useState<Storage>(() => {
    const storageAsString = localStorage.getItem("storage");
    if (storageAsString) {
      return JSON.parse(storageAsString);
    }
    return {
      conductors: [],
      loadedConductorId: null,
    } satisfies Storage;
  });

  useSyncStorage(storage);

  return [storage, setStorage];
}
