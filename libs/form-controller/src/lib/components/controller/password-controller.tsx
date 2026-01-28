import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { PasswordPattern } from '@symbiot-core-apps/shared';
import { Input } from '../form-element/input';

export function PasswordController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  matchTo,
  disabled,
  required,
  errors,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  matchTo?: string;
  disabled?: boolean;
  required?: boolean;
  errors: {
    required: string;
    validation: string;
    match?: string;
  };
  onBlur?: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) =>
          !required && !value
            ? true
            : String(value).match(PasswordPattern)
              ? !matchTo || matchTo === value
                ? true
                : errors.match
              : errors.validation,
        required: {
          value: Boolean(required),
          message: errors.required,
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          enterKeyHint="done"
          type="password"
          disabled={disabled}
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
