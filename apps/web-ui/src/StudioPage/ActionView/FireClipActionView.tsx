import { FireClipAction } from "@loop-conductor/common";
import { FormElement, Input, Label } from "../../Shared";

interface Props {
  action: FireClipAction;
  onChange: (action: FireClipAction) => void;
}

export function FireClipActionView({ action, onChange }: Props) {
  return (
    <div className="">
      <FormElement>
        <Label text="Track name" />
        <Input
          type="text"
          placeholder="Track name"
          className="w-20"
          value={action.trackName.toString()}
          onChange={(trackName) => onChange({ ...action, trackName })}
        />
      </FormElement>
      <FormElement>
        <Label text="Scene name" />
        <Input
          type="text"
          placeholder="Scene name"
          className="w-20"
          value={action.sceneName.toString()}
          onChange={(sceneName) => onChange({ ...action, sceneName })}
        />
      </FormElement>
    </div>
  );
}
