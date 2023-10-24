import { createContext, useContext } from "react";
import { Conductor } from ".";

const conductorContext = createContext<Conductor | null>(null);

export function ConductorProvider({
  conductor,
  children,
}: {
  conductor: Conductor;
  children: React.ReactNode;
}) {
  return (
    <conductorContext.Provider value={conductor}>
      {children}
    </conductorContext.Provider>
  );
}

export function useConductorContext(): Conductor {
  const conductor = useContext(conductorContext);
  if (conductor === null) {
    throw new Error(
      "useConductorContext must be used within a ConductorProvider"
    );
  }
  return conductor;
}
