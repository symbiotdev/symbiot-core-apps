import { countries, TCountryCode } from 'countries-list';
import { RegularText } from '../text/text';
import { SelectPicker } from './select-picker';
import { PickerOnChange } from './picker';

const getCountryEmoji = (code: string) => {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(
      (char) => 0x1f1e6 + char.charCodeAt(0) - 'A'.charCodeAt(0),
    ),
  );
};

const options = (Object.keys(countries) as TCountryCode[]).map((code) => ({
  label: countries[code].native,
  description: countries[code].name,
  value: code,
  icon: <RegularText fontSize={34}>{getCountryEmoji(code)}</RegularText>,
}));

export const CountryPicker = ({
  value,
  label,
  sheetLabel,
  error,
  placeholder,
  disabled,
  onChange,
}: {
  value?: TCountryCode;
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
