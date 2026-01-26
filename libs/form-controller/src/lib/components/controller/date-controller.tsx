import { DatePicker } from '@symbiot-core-apps/ui';
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

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
  const { me } = useCurrentAccountState();

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
          formatStr={me?.preferences?.dateFormat}
          weekStartsOn={me?.preferences?.appearance?.calendar?.weekStartsOn}
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
