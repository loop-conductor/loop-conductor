import { IconButton } from "../Shared";

interface Props {
  onSidebarOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  conductorName?: string;
}
export function NavBar({ onSidebarOpen, isSidebarOpen, conductorName }: Props) {
  return (
    <div className="flex gap-4 w-full p-4 justify-center items-center bg-cyan-700 text-zinc-200 shadow-lg border-cyan-900 border-b">
      <div className="flex-none">
        <IconButton
          iconName="menu"
          onClick={() => onSidebarOpen(!isSidebarOpen)}
        />
      </div>
      <div className="flex-1 flex items-baseline gap-4">
        <span className="text-xl">LoopConductor </span>
        {conductorName !== undefined && (
          <span className="text-sm"> [ {conductorName} ] </span>
        )}
      </div>
    </div>
  );
}
