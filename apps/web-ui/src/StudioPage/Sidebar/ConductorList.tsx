import { useCallback } from "react";
import { Conductor, IconButton, Input, classNames } from "../../Shared";

interface Props {
  conductors: Conductor[];
  onLoadConductor: (id: string) => void;
  onDeleteConductor: (id: string) => void;
  onRenameConductor: (id: string, name: string) => void;
  loadedConductorId: string | null;
}

export function ConductorList({
  onLoadConductor,
  onDeleteConductor,
  onRenameConductor,
  conductors,
  loadedConductorId,
}: Props) {
  const handleDelete = useCallback(
    (id: string) => {
      onDeleteConductor(id);
    },
    [onDeleteConductor]
  );

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {conductors.map((conductor) => (
        <button
          className={classNames(
            "rounded mx-2 px-4 py-2 text-left text-zinc-200 border border-transparent hover:border-cyan-900 ",
            "flex items-center justify-between group",
            loadedConductorId === conductor.id ? "bg-cyan-600" : ""
          )}
          key={conductor.id}
          onClick={() => onLoadConductor(conductor.id)}
        >
          <Input
            type="text"
            value={conductor.name}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onKeyUp={(event) => {
              event.preventDefault();
            }}
            onChange={(name) => onRenameConductor(conductor.id, name)}
          />
          <IconButton
            iconName="delete"
            className="ml-2 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 "
            onClick={(event) => {
              event.stopPropagation();
              handleDelete(conductor.id);
            }}
          />
        </button>
      ))}
    </div>
  );
}
