import {
  Conductor,
  MidiVendorId,
  midiCommandToBuffer,
} from "@loop-conductor/common";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WebMidi } from "webmidi";

export function useMidiInit(): boolean {
  const [isMidiReady, setIsMidiReady] = useState(false);
  useEffect(() => {
    WebMidi.enable({ sysex: true })
      .then(() => {
        setIsMidiReady(true);
        console.log("Midi ready");
      })
      .catch((err) => {
        console.error("Failed to enable midi", err);
      });
  }, []);

  return isMidiReady;
}

export function useMidiToolkit(): {
  sendLoadConductor: (args: {
    conductor: Conductor;
    outputName: string;
  }) => void;
  listOutputNames: () => string[];
} {
  const sendLoadConductor = useCallback(
    (args: { conductor: Conductor; outputName: string }): void => {
      const { conductor, outputName } = args;
      const output = WebMidi.outputs.find((o) => o.name === outputName);
      if (!output) {
        console.warn("Invalid midi output name", outputName);
        return;
      }

      output.sendSysex(
        MidiVendorId,
        midiCommandToBuffer({
          type: "loadConductor",
          conductor,
        })
      );
    },
    []
  );

  const listOutputNames = useCallback((): string[] => {
    return WebMidi.outputs.map((o) => o.name);
  }, []);

  return useMemo(
    () => ({
      sendLoadConductor,
      listOutputNames,
    }),
    [sendLoadConductor]
  );
}
