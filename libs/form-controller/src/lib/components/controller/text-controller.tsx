import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Textarea } from '../form-element/textarea';

export function TextController<T extends FieldValues>({
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
        <Textarea
          countCharacters
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
