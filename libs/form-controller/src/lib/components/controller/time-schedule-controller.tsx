import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { TimeSchedule } from '../form-element/time-schedule';

export function TimeScheduleController<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
  required,
  rules,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label?: string;
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
        <TimeSchedule
          value={value}
          label={label}
          error={error?.message}
          required={required}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
