interface Props {
  text: string;
}

export function Label({ text }: Props) {
  return <label className="text-sm flex-grow text-zinc-600">{text}</label>;
}
