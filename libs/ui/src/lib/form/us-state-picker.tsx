import states from 'states-us';
import { SelectPicker } from './select-picker';
import { PickerOnChange } from './picker';

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
