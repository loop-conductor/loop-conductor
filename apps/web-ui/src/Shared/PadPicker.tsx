import {
  FloatingFocusManager,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useCallback, useState } from "react";
import { Button } from "./Button";
import { useConductor } from "./ConductorContext";
import { IconButtonProps } from "./IconButton";
import { useAvailablePadIds } from "./useAvailablePadIds";

interface Props
  extends Omit<IconButtonProps, "value" | "onChange" | "iconName"> {
  value: number;
  onChange: (value: number) => void;
}

const GridX = [0, 1, 2, 3];
const GridY = [0, 1, 2];

export function PadPicker({ value, onChange, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const availablePadIds = useAvailablePadIds(useConductor());

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleItemClick = useCallback(
    (padId: number) => {
      onChange(padId);
      setIsOpen(false);
    },
    [onChange, setIsOpen]
  );

  return (
    <>
      <Button
        leadingIconName="grid_on"
        label={`Pad ${value}`}
        ref={refs.setReference}
        {...getReferenceProps()}
        className="px-2 py-1 text-sm"
      />
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="bg-zinc-200 z-10 rounded shadow-lg p-2 border border-zinc-400 flex flex-col gap-1"
          >
            {GridY.map((y) => (
              <div className="flex gap-1">
                {GridX.map((x) => {
                  const padId = x + y * 4 + 1;
                  return (
                    <Button
                      label={`${padId}`}
                      onClick={() => handleItemClick(padId)}
                      className="px-2 py-1 w-[1.5rem] h-[1.5rem] text-xs bg-zinc-400 border-zinc-600"
                      disabled={!availablePadIds.includes(padId)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}
