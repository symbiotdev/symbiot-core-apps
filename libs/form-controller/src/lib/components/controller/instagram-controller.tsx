import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { InstagramInput } from '@symbiot-core-apps/ui';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function InstagramController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  required,
  rules,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <InstagramInput
          enterKeyHint="done"
          disabled={disabled}
          required={required}
          value={value}
          label={label}
          placeholder={placeholder}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
