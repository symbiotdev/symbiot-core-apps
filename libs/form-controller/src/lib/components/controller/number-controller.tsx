import { Input } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function NumberController<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  required,
  disabled,
  maxLength,
  control,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          type="numeric"
          keyboardType="numeric"
          regex={/\d+/}
          disabled={disabled}
          maxLength={maxLength}
          enterKeyHint="done"
          required={required}
          value={value}
          error={error?.message}
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
