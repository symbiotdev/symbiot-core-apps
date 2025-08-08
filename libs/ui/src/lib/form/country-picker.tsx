import { countries, TCountryCode } from 'countries-list';
import { RegularText } from '../text/text';
import { SelectPicker } from './select-picker';
import { PickerOnChange } from './picker';
import { Platform } from 'react-native';
import { getCountryEmoji } from '@symbiot-core-apps/shared';

const options = (Object.keys(countries) as TCountryCode[]).map((value) => {
  const flag = getCountryEmoji(value);

  return {
    value,
    label:
      `${Platform.OS === 'ios' ? flag : ''} ${countries[value].native}`.trim(),
    description: countries[value].name,
    icon: <RegularText fontSize={34}>{flag}</RegularText>,
  };
});

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
