import { Conductor } from "@loop-conductor/common";
import { createContext, useContext } from "react";

const conductorContext = createContext<Conductor | undefined>(undefined);

export function ConductorProvider({
  conductor,
  children,
}: {
  conductor: Conductor | undefined;
  children: React.ReactNode;
}) {
  return (
    <conductorContext.Provider value={conductor}>
      {children}
    </conductorContext.Provider>
  );
}

export function useConductor(): Conductor | undefined {
  const conductor = useContext(conductorContext);
  return conductor;
}
