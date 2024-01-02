import { MemoAction } from "@loop-conductor/common";
import { FormElement, TextArea } from "../../Shared";

interface Props {
  action: MemoAction;
  onChange: (action: MemoAction) => void;
}

export function MemoActionView({ action, onChange }: Props) {
  return (
    <div className="">
      <FormElement>
        <TextArea
          placeholder="Scene name"
          className="w-full h-full resize-none"
          value={action.memo}
          onChange={(memo) => onChange({ ...action, memo })}
        />
      </FormElement>
    </div>
  );
}
