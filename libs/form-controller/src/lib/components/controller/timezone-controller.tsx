import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { TimezonePicker } from '../form-element/timezone-picker';

export function TimezoneController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  country,
  disabled,
  disableDrag,
  rules,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  country?: string;
  disabled?: boolean;
  disableDrag?: boolean;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <TimezonePicker
          disableDrag={disableDrag}
          disabled={disabled}
          onlyCountryTimezones={!!country}
          country={country}
          value={value}
          error={error?.message}
          label={label}
          sheetLabel={label}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
