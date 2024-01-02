import { FireSceneAction } from "@loop-conductor/common";
import { FormElement, Input, Label } from "../../Shared";

interface Props {
  action: FireSceneAction;
  onChange: (action: FireSceneAction) => void;
}

export function FireSceneActionView({ action, onChange }: Props) {
  return (
    <div className="">
      <FormElement>
        <Label text="Scene name" />
        <Input
          type="text"
          placeholder="Scene name"
          className="input input-xs w-20"
          value={action.sceneName.toString()}
          readonly
        />
      </FormElement>
    </div>
  );
}
