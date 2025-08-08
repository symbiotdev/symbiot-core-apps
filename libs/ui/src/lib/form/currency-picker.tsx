import { currencySymbol } from '@symbiot-core-apps/shared';
import { PickerOnChange } from './picker';
import { SelectPicker } from './select-picker';

const options = Array.from(Object.keys(currencySymbol)).map((currency) => ({
  label: `${currency} · ${currencySymbol[currency]}`,
  value: currency,
}));

export const CurrencyPicker = ({
  value,
  label,
  sheetLabel,
  error,
  placeholder,
  disabled,
  onChange,
}: {
  value?: string;
  label?: string;
  sheetLabel?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (code: string) => void;
}) => (
  <SelectPicker
    lazy
    moveSelectedToTop
    sheetLabel={sheetLabel}
    label={label}
    value={value}
    error={error}
    placeholder={placeholder}
    disabled={disabled}
    options={options}
    onChange={onChange as PickerOnChange}
  />
);
