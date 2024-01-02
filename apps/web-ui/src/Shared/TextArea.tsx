import { ChangeEvent, HTMLAttributes, useCallback } from "react";
import { classNames } from "./Utils";

interface Props
  extends Omit<HTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
}

export function TextArea({
  value,
  onChange,
  readonly,
  className,
  ...props
}: Props) {
  const handleOnChange = useCallback(
    (event: ChangeEvent) => {
      onChange?.((event.target as HTMLInputElement).value);
    },
    [onChange]
  );

  return (
    <textarea
      value={value}
      onChange={handleOnChange}
      readOnly={readonly}
      {...props}
      className={classNames(
        "bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded",
        "focus:outline-none focus:border-cyan-700 p-1",
        "min-w-[8rem]",
        className
      )}
    />
  );
}
