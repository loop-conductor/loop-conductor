import { HTMLAttributes } from "react";
import { classNames } from "./Utils";

interface Props
  extends Omit<HTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export function Checkbox({ value, onChange }: Props) {
  return (
    <input
      className={classNames(
        "w-4 h-4 text-cyan-700 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 outline-none"
      )}
      type="checkbox"
      checked={value}
      onChange={(event) => onChange?.(event.target.checked)}
    />
  );
}
