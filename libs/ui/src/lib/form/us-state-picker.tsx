import states from 'states-us';
import { SelectPicker } from './select-picker';
import { PickerOnChange } from './picker';
import { useEffect } from 'react';

const options = states.map((state) => ({
  value: state.abbreviation,
  label: state.name,
}));

export const UsStatePicker = ({
  value,
  label,
  sheetLabel,
  error,
  placeholder,
  preventEmptyValue,
  disabled,
  disableDrag,
  onChange,
}: {
  value?: string;
  label?: string;
  sheetLabel?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  disableDrag?: boolean;
  preventEmptyValue?: boolean;
  onChange: (code: string) => void;
}) => {
  useEffect(() => {
    if (preventEmptyValue && !value) {
      onChange(options[0].value);
    }
  }, [onChange, preventEmptyValue, value]);

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
