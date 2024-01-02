import { MetronomeAction } from "@loop-conductor/common";
import { Checkbox, FormElement, Label } from "../../Shared";

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
