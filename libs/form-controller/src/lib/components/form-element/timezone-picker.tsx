import { SelectPicker } from './select-picker';
import { PickerOnChange } from './picker';
import {
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
  required,
  disableDrag,
  onlyCountryTimezones,
  onChange,
  onBlur,
}: {
  value?: string;
  country?: string;
  label?: string;
  sheetLabel?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  disableDrag?: boolean;
  onlyCountryTimezones?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) => {
  const options = useMemo(() => {
    const allTimezones = Object.values(getAllTimezones());
    const timezones = onlyCountryTimezones
      ? country
        ? getTimezonesForCountry(country) || []
        : []
      : allTimezones;

    if (value && !timezones.some((timezone) => timezone.name === value)) {
      const currentTimezone = allTimezones.find(
        (timezone) => timezone.name === value,
      );

      if (currentTimezone) {
        timezones.push(currentTimezone);
      }
    }

    return timezones
      .map(({ name, utcOffsetStr }) => {
        return {
          value: name,
          label: `${utcOffsetStr}${Platform.OS === 'ios' ? ` · ${name}` : ''}`,
          description: name,
        };
      })
      .sort((a, b) => (a.label > b.label ? 1 : -1));
  }, [country, onlyCountryTimezones, value]);

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
      required={required}
      disableDrag={disableDrag}
      options={options}
      onChange={onChange as PickerOnChange}
      onBlur={onBlur}
    />
  );
};
