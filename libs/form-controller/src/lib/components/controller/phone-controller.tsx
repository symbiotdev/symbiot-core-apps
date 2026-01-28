import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { PhoneNumber } from 'react-native-phone-input/dist';
import { PhoneInput } from '../form-element/phone-input';

export function PhoneController<T extends FieldValues>({
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
        validate: (value) => {
          if (!required && !value) {
            return true;
          } else {
            if (
              PhoneNumber.isValidNumber(
                PhoneNumber.getNumeric(value),
                PhoneNumber.getCountryCodeOfNumber(value),
              )
            ) {
              return true;
            } else {
              return value ? errors.validation : errors.required;
            }
          }
        },
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <PhoneInput
          required={required}
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
