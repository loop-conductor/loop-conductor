import { FormElement, Input, Label, TempoAction } from "../../Shared";

interface Props {
  action: TempoAction;
  onChange: (action: TempoAction) => void;
}

export function TempoActionView({ action, onChange }: Props) {
  return (
    <div className="">
      <FormElement>
        <Label text="Tempo" />
        <Input
          type="number"
          placeholder="Tempo"
          className="w-20"
          value={action.tempo}
          onChange={(tempo) => onChange({ ...action, tempo })}
        />
      </FormElement>
    </div>
  );
}
