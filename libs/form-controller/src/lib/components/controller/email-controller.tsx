import { Input } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { EmailPattern } from '@symbiot-core-apps/shared';

export function EmailController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  required,
  errors,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  errors: {
    required: string;
    validation: string;
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
            : String(value).match(EmailPattern)
              ? true
              : errors.validation,
        required: {
          value: Boolean(required),
          message: errors.required,
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          enterKeyHint="done"
          type="email"
          keyboardType="email-address"
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
