import { Conductor } from "@loop-conductor/common";
import { produce } from "immer";
import { useCallback, useState } from "react";
import { useMidiInit, useSyncConductor } from "../Midi";
import { ConductorProvider, getUUID } from "../Shared";
import {
  useConductorFromStorage,
  useStorage,
  useSyncStorage,
} from "../Storage";
import { ConductorView } from "./ConductorView";
import { NavBar } from "./NavBar";
import { Sidebar } from "./Sidebar";

export function StudioPage() {
  const isMidiReady = useMidiInit();
  const [storage, setStorage] = useStorage();
  const [conductor, setConductor] = useConductorFromStorage(
    storage,
    setStorage
  );

  useSyncStorage(storage);
  useSyncConductor({ conductor, midiOutputName: storage.midiOutputName });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const handleConductorChange = useCallback(
    (conductor: Conductor) => {
      console.log("handleConductorChange", conductor);
      setConductor(conductor);
    },
    [setConductor]
  );

  const handleLoadConductor = useCallback(
    (id: string) => {
      setStorage({
        ...storage,
        loadedConductorId: id,
      });

      setIsSidebarOpen(false);
    },
    [storage, setStorage]
  );
  const handleRenameConductor = useCallback(
    (id: string, name: string) => {
      setStorage(
        produce(storage, (draft) => {
          const index = draft.conductors.findIndex((c) => c.id === id);
          draft.conductors[index].name = name;
          return draft;
        })
      );
    },
    [storage, setStorage]
  );
  const handleCreateConductor = useCallback(() => {
    setStorage(
      produce(storage, (draft) => {
        draft.conductors.push({
          id: getUUID(),
          name: "New conductor",
          sequences: [],
        });
        return draft;
      })
    );
  }, [storage, setStorage]);

  const handleDeleteConductor = useCallback(
    (id: string) => {
      setStorage(
        produce(storage, (draft) => {
          draft.conductors = draft.conductors.filter((c) => c.id !== id);
          return draft;
        })
      );
    },
    [storage, setStorage]
  );
  const handleMidiOutputChange = useCallback(
    (outputName: string) => {
      setStorage(
        produce(storage, (draft) => {
          draft.midiOutputName = outputName;
          return draft;
        })
      );

      setIsSidebarOpen(false);
    },
    [storage, setStorage]
  );

  if (!isMidiReady) {
    return null;
  }
  return (
    <ConductorProvider conductor={conductor}>
      <div className="bg-zinc-700 flex flex-col h-screen">
        <NavBar
          onSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          conductorName={conductor?.name}
        />
        <div className="relative min-h-0 flex-grow">
          <Sidebar
            open={isSidebarOpen || !conductor}
            storage={storage}
            onSidebarOpen={setIsSidebarOpen}
            onLoadConductor={handleLoadConductor}
            onRenameConductor={handleRenameConductor}
            onCreateConductor={handleCreateConductor}
            onDeleteConductor={handleDeleteConductor}
            onMidiOutputChange={handleMidiOutputChange}
          />
          {conductor && (
            <ConductorView
              conductor={conductor}
              onConductorChange={handleConductorChange}
            />
          )}
          {!conductor && <div />}
        </div>
      </div>
    </ConductorProvider>
  );
}

export default StudioPage;
