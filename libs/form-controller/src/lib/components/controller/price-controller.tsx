import { PriceInput } from '@symbiot-core-apps/ui';
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Currency } from '@symbiot-core-apps/api';

export function PriceController<T extends FieldValues>({
  name,
  label,
  placeholder,
  max,
  rules,
  required,
  disabled,
  currency,
  control,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  currency?: Currency;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <PriceInput
          symbol={currency?.symbol}
          label={label}
          placeholder={placeholder}
          max={max}
          disabled={disabled}
          required={required}
          value={value}
          error={error?.message}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
