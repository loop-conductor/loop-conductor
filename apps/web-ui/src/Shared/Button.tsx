import { HTMLAttributes, forwardRef } from "react";
import { Icon } from "./Icon";
import { classNames } from "./Utils";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  leadingIconName?: string;
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      leadingIconName,
      onClick,
      size = "md",
      className,
      disabled,
      ...props
    }: ButtonProps,
    ref
  ) => {
    const sizeMap: Record<Exclude<ButtonProps["size"], undefined>, string> = {
      lg: "text-lg",
      md: "text-md",
      sm: "text-sm",
    };
    return (
      <button
        ref={ref}
        onClick={onClick}
        {...props}
        disabled={disabled}
        className={classNames(
          sizeMap[size],
          "flex items-center justify-center gap-2",
          "p-2 text-zinc-100 duration-75 bg-cyan-600 rounded-lg hover:bg-cyan-700 active:bg-cyan-800 border border-cyan-900",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          className
        )}
      >
        {leadingIconName && <Icon name={leadingIconName} size={size} />}
        {label}
      </button>
    );
  }
);
