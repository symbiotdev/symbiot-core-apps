import { DatePicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function DateController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
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
          weekStartsOn={me?.preferences?.weekStartsOn}
          minDate={DateHelper.addYears(new Date(), -100)}
          maxDate={new Date()}
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
