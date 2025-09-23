import { Switch } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function SwitchController<T extends FieldValues>({
  name,
  label,
  description,
  rules,
  disabled,
  required,
  loading,
  control,
  onChange: onPropsChange,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  description: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rules?: ControllerProps<T>['rules'];
  onChange?: (value: boolean) => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <Switch
          label={label}
          description={description}
          required={required}
          loading={loading}
          disabled={disabled}
          checked={!!value}
          onChange={(value) => {
            onChange(value);
            onPropsChange?.(value);
          }}
        />
      )}
    />
  );
}
