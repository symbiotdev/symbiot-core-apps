import { SelectPicker } from './select-picker';
import { PickerOnChange } from './picker';
import {
  CountryCode,
  getAllTimezones,
  getTimezonesForCountry,
} from 'countries-and-timezones';
import { useEffect, useMemo } from 'react';
import { Platform } from 'react-native';

export const TimezonePicker = ({
  value,
  country,
  label,
  sheetLabel,
  error,
  placeholder,
  disabled,
  disableDrag,
  onlyCountryTimezones,
  onChange,
}: {
  value?: string;
  country?: CountryCode;
  label?: string;
  sheetLabel?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  disableDrag?: boolean;
  onlyCountryTimezones?: boolean;
  onChange: (value: string) => void;
}) => {
  const options = useMemo(() => {
    const timezones = onlyCountryTimezones
      ? country
        ? getTimezonesForCountry(country)
        : []
      : Object.values(getAllTimezones());

    return timezones
      .map(({ name, utcOffsetStr }) => {
        return {
          value: name,
          label: `${utcOffsetStr}${Platform.OS === 'ios' ? ` · ${name}` : ''}`,
          description: name,
        };
      })
      .sort((a, b) => (a.label > b.label ? 1 : -1));
  }, [country, onlyCountryTimezones]);

  useEffect(() => {
    if (onlyCountryTimezones) {
      if (
        options.length &&
        !options.some((timezone) => timezone.value === value)
      ) {
        onChange(options[0].value);
      }
    }
  }, [onChange, onlyCountryTimezones, options, value]);

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
      disableDrag={disableDrag}
      options={options}
      onChange={onChange as PickerOnChange}
    />
  );
};
