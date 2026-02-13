import { PickerOnChange } from './picker';
import {
  getAllTimezones,
  getTimezonesForCountry,
} from 'countries-and-timezones';
import { useEffect, useMemo } from 'react';
import { isIos } from '@symbiot-core-apps/shared';
import { SmartSelect } from './smart-select';

export const TimezonePicker = ({
  value,
  country,
  label,
  error,
  placeholder,
  disabled,
  required,
  onlyCountryTimezones,
  onChange,
  onBlur,
}: {
  value?: string;
  country?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
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
          label: `${utcOffsetStr}${isIos ? ` · ${name}` : ''}`,
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
    <SmartSelect
      label={label}
      value={value}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      options={options}
      onChange={onChange as PickerOnChange}
      onBlur={onBlur}
    />
  );
};
