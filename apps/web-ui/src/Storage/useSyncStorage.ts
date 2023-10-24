import { useEffect } from "react";
import { Storage } from "./Types";

export function useSyncStorage(storage: Storage) {
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem("storage", JSON.stringify(storage));
    }, 500);

    return () => clearTimeout(id);
  }, [storage]);
}
