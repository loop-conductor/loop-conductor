interface Props {
  name: string;
  size?: "lg" | "md" | "sm" | "xs";
}

export function Icon({ name, size = "md" }: Props) {
  const sizeMap = {
    lg: "!text-[0.75rem]",
    md: "!text-[0.875rem]",
    sm: "!text-[0.75rem]",
    xs: "!text-[0.75rem]",
  };
  return (
    <span className={`material-symbols-outlined ${sizeMap[size]}`}>{name}</span>
  );
}
