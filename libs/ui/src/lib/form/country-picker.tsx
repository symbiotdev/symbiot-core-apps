import { RegularText } from '../text/text';
import { SelectPicker } from './select-picker';
import { PickerOnChange } from './picker';
import { Platform } from 'react-native';
import {
  countryNameInNativeLanguage,
  getCountryEmoji,
} from '@symbiot-core-apps/shared';
import { CountryCode, getAllCountries } from 'countries-and-timezones';
import { useMemo } from 'react';

export const CountryPicker = ({
  value,
  label,
  sheetLabel,
  error,
  placeholder,
  disabled,
  required,
  disableDrag,
  onChange,
}: {
  value?: CountryCode;
  label?: string;
  sheetLabel?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  disableDrag?: boolean;
  onChange: (code: string) => void;
}) => {
  const options = useMemo(() => {
    const countries = getAllCountries();
    const countryKeys = Object.keys(countries) as CountryCode[];

    return countryKeys.map((value) => {
      const flag = getCountryEmoji(value);

      return {
        value,
        label:
          `${Platform.OS === 'ios' ? flag : ''} ${countryNameInNativeLanguage[value] || countries[value].name}`.trim(),
        description: countries[value].name,
        icon: <RegularText fontSize={34}>{flag}</RegularText>,
      };
    });
  }, []);

  return (
    <SelectPicker
      lazy
      moveSelectedToTop
      sheetLabel={sheetLabel}
      label={label}
      value={value}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      disableDrag={disableDrag}
      options={options}
      onChange={onChange as PickerOnChange}
    />
  );
};
