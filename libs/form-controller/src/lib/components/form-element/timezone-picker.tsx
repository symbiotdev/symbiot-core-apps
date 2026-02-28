import { PickerOnChange } from './picker';
import {
  getAllTimezones,
  getTimezonesForCountry,
  Timezone,
} from 'countries-and-timezones';
import { useEffect, useMemo } from 'react';
import { isIos } from '@symbiot-core-apps/shared';
import { Select } from './select';

export const TimezonePicker = ({
  value,
  countries,
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
  countries?: string[];
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
      ? countries
        ? (countries
            .flatMap((country) => getTimezonesForCountry(country))
            .filter(Boolean) as Timezone[])
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
  }, [countries, onlyCountryTimezones, value]);

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
    <Select
      searchable
      moveSelectedToTop
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
