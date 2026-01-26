import { DurationPicker, DurationPickerUnit } from '@symbiot-core-apps/ui';
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';

export function DurationController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  required,
  rules,
  units,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  units: DurationPickerUnit[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DurationPicker
          value={value}
          error={error?.message}
          label={label}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          units={units}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
