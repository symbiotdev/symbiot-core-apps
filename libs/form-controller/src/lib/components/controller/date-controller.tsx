import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { DateHelper } from '@symbiot-core-apps/shared';
import { DatePicker } from '../form-element/date-picker';

export function DateController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  minDate,
  maxDate,
  disabled,
  disableDrag,
  required,
  rules,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  disableDrag?: boolean;
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
        <DatePicker
          required={required}
          disabled={disabled}
          disableDrag={disableDrag}
          value={value}
          error={error?.message}
          minDate={minDate || DateHelper.addYears(new Date(), -100)}
          maxDate={maxDate || DateHelper.addYears(new Date(), 100)}
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
