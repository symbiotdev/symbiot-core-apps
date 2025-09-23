import { PriceInput } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form/dist/types';
import { Currency } from '@symbiot-core-apps/api';

export function PriceController<T extends FieldValues>({
  name,
  label,
  placeholder,
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
          disabled={disabled}
          placeholder={placeholder}
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
