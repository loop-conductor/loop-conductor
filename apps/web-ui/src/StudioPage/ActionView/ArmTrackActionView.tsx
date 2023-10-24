import {
  ArmTrackAction,
  Checkbox,
  FormElement,
  Input,
  Label,
} from "../../Shared";

interface Props {
  action: ArmTrackAction;
  onChange: (action: ArmTrackAction) => void;
}

export function ArmTrackActionView({ action, onChange }: Props) {
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
        <Label text="Armed" />
        <Checkbox
          value={action.armed ? true : false}
          onChange={(armed) => onChange({ ...action, armed: armed ? 1 : 0 })}
        />
      </FormElement>
    </div>
  );
}
