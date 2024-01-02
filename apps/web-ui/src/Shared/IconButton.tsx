import { HTMLAttributes, forwardRef } from "react";
import { Icon } from "./Icon";
import { classNames } from "./Utils";

export interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  iconName: string;
  size?: "lg" | "md" | "sm";
  disabled?: boolean;
  destructive?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      iconName,
      onClick,
      size = "md",
      disabled,
      className,
      destructive,
      ...props
    }: IconButtonProps,
    ref
  ) => {
    const sizeMap: Record<
      Exclude<IconButtonProps["size"], undefined>,
      string
    > = {
      lg: "h-8 w-8",
      md: "h-6 w-6",
      sm: "h-4 w-4",
    };
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        {...props}
        className={classNames(
          sizeMap[size],
          "flex items-center justify-center  border border-cyan-900",
          "p-1  duration-75 transition-colors bg-cyan-600 rounded-lg",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          destructive
            ? "hover:text-orange-100 hover:bg-orange-600 active:bg-orange-400 text-orange-900"
            : "hover:bg-cyan-500 active:bg-cyan-400 text-cyan-900",
          className
        )}
      >
        <Icon name={iconName} size={size} />
      </button>
    );
  }
);
