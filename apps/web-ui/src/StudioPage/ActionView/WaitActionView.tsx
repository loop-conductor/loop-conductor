import { WaitAction } from "@loop-conductor/common";
import { FormElement, Input, Label } from "../../Shared";

interface Props {
  action: WaitAction;
  onChange: (action: WaitAction) => void;
}

export function WaitActionView({ action, onChange }: Props) {
  return (
    <div className="">
      <FormElement>
        <Label text="Bar count" />
        <Input
          type="number"
          placeholder="Scene name"
          className="w-20"
          value={action.barCount}
          onChange={(barCount) => onChange({ ...action, barCount })}
        />
      </FormElement>
    </div>
  );
}
