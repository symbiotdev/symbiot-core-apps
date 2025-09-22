import { SelectPicker } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Gender } from '@symbiot-core-apps/api';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function GenderController<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  required,
  rules,
  genders,
  gendersLoading,
  gendersError,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  genders?: Gender[];
  label: string;
  placeholder: string;
  gendersLoading?: boolean;
  gendersError?: string | null;
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
        <SelectPicker
          required={required}
          disabled={disabled}
          value={value}
          error={error?.message}
          options={genders}
          optionsLoading={gendersLoading}
          optionsError={gendersError}
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
