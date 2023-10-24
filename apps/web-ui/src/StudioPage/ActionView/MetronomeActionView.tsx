import { Checkbox, FormElement, Label, MetronomeAction } from "../../Shared";

interface Props {
  action: MetronomeAction;
  onChange: (action: MetronomeAction) => void;
}

export function MetronomeActionView({ action, onChange }: Props) {
  return (
    <div className="">
      <FormElement>
        <Label text="Enable" />
        <Checkbox
          value={action.enable ? true : false}
          onChange={(enable) => onChange({ ...action, enable: enable ? 1 : 0 })}
        />
      </FormElement>
    </div>
  );
}
