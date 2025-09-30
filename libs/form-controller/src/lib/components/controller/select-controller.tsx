import { PickerItem, SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function SelectController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  disableDrag,
  required,
  rules,
  options,
  optionsLoading,
  optionsError,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder: string;
  options?: PickerItem[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  disabled?: boolean;
  disableDrag?: boolean;
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
        <SelectPicker
          required={required}
          disabled={disabled}
          disableDrag={disableDrag}
          value={value}
          error={error?.message}
          options={options}
          optionsLoading={optionsLoading}
          optionsError={optionsError}
          label={label}
          sheetLabel={label}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
