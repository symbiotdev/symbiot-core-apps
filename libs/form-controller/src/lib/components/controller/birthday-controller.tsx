import { DatePicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function BirthdayController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  rules,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  disabled?: boolean;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  const { me } = useCurrentAccount();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DatePicker
          disabled={disabled}
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
