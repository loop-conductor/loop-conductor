import { useMemo } from "react";
import { useMidiToolkit } from "../../Midi";
import { IconButton, MenuButton, MenuItem, classNames } from "../../Shared";
import { Storage } from "../../Storage";
import { ConductorList } from "./ConductorList";

interface Props {
  open: boolean;
  storage: Storage;
  onSidebarOpen: (open: boolean) => void;
  onLoadConductor: (id: string) => void;
  onRenameConductor: (id: string, name: string) => void;
  onCreateConductor: () => void;
  onDeleteConductor: (id: string) => void;
  onMidiOutputChange: (outputName: string) => void;
}

export function Sidebar({
  open,
  onSidebarOpen,
  storage,
  onCreateConductor,
  onDeleteConductor,
  onRenameConductor,
  onLoadConductor,
  onMidiOutputChange,
}: Props) {
  const { listOutputNames } = useMidiToolkit();
  const midiOutputItems = useMemo(() => {
    return listOutputNames().map((name) => {
      return {
        label: name,
        onClick: () => onMidiOutputChange(name),
      } satisfies MenuItem;
    });
  }, [listOutputNames]);

  return (
    <>
      {open && (
        <div
          className="absolute w-full h-full bg-slate-900/50"
          onClick={() => onSidebarOpen(false)}
        />
      )}
      <div
        className={classNames(
          open ? "translate-x-0" : "-translate-x-[25rem]",
          "absolute transition-transform duration-100 rounded-lg bg-cyan-700 w-[20rem] top-0 bottom-0 z-10 shadow-lg m-4 border border-cyan-900",
          "flex flex-col gap-2 justify-between"
        )}
      >
        <div className="flex flex-col min-h-0">
          <div className="flex justify-between items-center gap-2 p-2">
            <div className=" text-lg font-medium text-zinc-200">Conductors</div>
            <IconButton iconName="add" onClick={onCreateConductor} />
          </div>
          <ConductorList
            conductors={storage.conductors}
            onLoadConductor={onLoadConductor}
            onDeleteConductor={onDeleteConductor}
            onRenameConductor={onRenameConductor}
            loadedConductorId={storage.loadedConductorId}
          />
        </div>

        <div className="flex flex-col justify-between gap-2 p-2">
          <div className="flex gap-2 justify-end">
            <IconButton iconName="download" />
            <IconButton iconName="upload" />
          </div>
          <div className="flex gap-2 justify-between text-zinc-200 text-sm">
            <div className="flex gap-1">
              <span>Midi output: </span>
              <span>{storage.midiOutputName}</span>
            </div>
            <MenuButton iconName="search" items={midiOutputItems} />
          </div>
        </div>
      </div>
    </>
  );
}
