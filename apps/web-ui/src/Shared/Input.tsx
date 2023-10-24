import { ChangeEvent, HTMLAttributes, useCallback } from "react";
import { classNames } from "./Utils";

interface NumberProps
  extends Omit<HTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  type: "number";
  readonly?: boolean;
}

interface TextProps
  extends Omit<HTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  type: "text";
  readonly?: boolean;
}

type Props = NumberProps | TextProps;

export function Input({
  value,
  onChange,
  type,
  readonly,
  className,
  ...props
}: Props) {
  const handleOnChange = useCallback(
    (event: ChangeEvent) => {
      if (type === "number") {
        onChange?.(parseInt((event.target as HTMLInputElement).value));
      } else {
        onChange?.((event.target as HTMLInputElement).value);
      }
    },
    [onChange, type]
  );

  return (
    <input
      type={type}
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
