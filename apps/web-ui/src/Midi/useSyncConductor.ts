import { Conductor } from "@loop-conductor/common";
import { useEffect } from "react";
import { useMidiToolkit } from "./useMidiToolkit";

export function useSyncConductor(args: {
  conductor?: Conductor;
  midiOutputName?: string;
}) {
  const { conductor, midiOutputName } = args;
  const { sendLoadConductor } = useMidiToolkit();

  useEffect(() => {
    const id = setTimeout(() => {
      if (!midiOutputName || !conductor) {
        return;
      }
      console.log("Syncing conductor");
      sendLoadConductor({
        conductor,
        outputName: midiOutputName,
      });
    }, 500);

    return () => clearTimeout(id);
  }, [conductor, sendLoadConductor]);
}
