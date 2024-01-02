import { classNames } from "./Utils";

interface Props {
  text: string;
  className?: string;
}

export function Label({ text, className }: Props) {
  return (
    <label className={classNames("text-sm flex-grow text-zinc-600", className)}>
      {text}
    </label>
  );
}
