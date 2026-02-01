import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Input } from '../form-element/input';

export function PromoCodeController<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  required,
  control,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  required?: boolean;
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
          enterKeyHint="done"
          regex={/^[a-zA-Z0-9_]+$/}
          value={value}
          required={required}
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
