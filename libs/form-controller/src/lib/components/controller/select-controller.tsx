import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { PickerItem } from '../form-element/picker';
import { Select } from '../form-element/select';

export function SelectController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  searchable,
  moveSelectedToTop,
  disabled,
  loading,
  required,
  rules,
  options,
  optionsLoading,
  optionsError,
  optionsLabel,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  optionsLabel?: string;
  placeholder: string;
  loading?: boolean;
  searchable?: boolean;
  moveSelectedToTop?: boolean;
  options?: PickerItem[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  disabled?: boolean;
  required?: boolean;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Select
          moveSelectedToTop={moveSelectedToTop}
          searchable={searchable}
          required={required}
          disabled={disabled}
          loading={loading}
          value={value}
          error={error?.message}
          options={options}
          optionsLoading={optionsLoading}
          optionsError={optionsError}
          optionsLabel={optionsLabel}
          label={label}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
