import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { ControllerProps } from 'react-hook-form/dist/types';
import { AddressPicker } from '../form-element/address-picker';

export function AddressController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rules,
  required,
  disabled,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  required?: boolean;
  rules?: ControllerProps<T>['rules'];
  disabled?: boolean;
  onBlur?: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <AddressPicker
          required={required}
          disabled={disabled}
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
