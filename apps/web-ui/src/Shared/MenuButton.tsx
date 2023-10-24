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
import { IconButton, IconButtonProps } from "./IconButton";

export interface MenuItem {
  label: string;
  onClick?: () => void;
}

interface Props extends IconButtonProps {
  items: MenuItem[];
}

export function MenuButton({ items, iconName, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleItemClick = useCallback((item: MenuItem) => {
    item.onClick?.();
    setIsOpen(false);
  }, []);

  return (
    <>
      <IconButton
        iconName={iconName}
        ref={refs.setReference}
        {...getReferenceProps()}
      />
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="bg-zinc-200 z-10 rounded shadow-lg p-2 border border-zinc-400 flex flex-col gap-1 min-w-[10rem]"
          >
            {items.map((item) => (
              <div
                key={item.label}
                className="text-zinc-600 px-2 py-1 rounded hover:bg-zinc-100 cursor-pointer text-sm"
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}
