import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Input } from '../form-element/input';

export function StringController<T extends FieldValues>({
  name,
  label,
  placeholder,
  rules,
  maxLength,
  required,
  control,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  required?: boolean;
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
          autoCapitalize="words"
          enterKeyHint="done"
          required={required}
          value={value}
          maxLength={maxLength}
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
