import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { isValidURL } from '@symbiot-core-apps/shared';
import { WebsiteInput } from '@symbiot-core-apps/ui';

export function WebsiteController<T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  errors,
  control,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  required?: boolean;
  errors?: {
    validation: string;
  };
  onBlur?: () => void;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) =>
          (!required && !value) || (value && isValidURL(value))
            ? true
            : errors?.validation,
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <WebsiteInput
          enterKeyHint="done"
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
