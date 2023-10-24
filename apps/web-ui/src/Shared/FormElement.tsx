import { PropsWithChildren } from "react";

export function FormElement({ children }: PropsWithChildren<{}>) {
  return <div className="flex pt-1 pb-1 gap-2 items-center">{children}</div>;
}
