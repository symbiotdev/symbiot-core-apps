import { Checkbox } from '@symbiot-core-apps/ui';
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { ReactElement } from 'react';

export function CheckboxController<T extends FieldValues>({
  name,
  label,
  rules,
  disabled,
  control,
  onChange: onPropsChange,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string | ReactElement;
  disabled?: boolean;
  rules?: ControllerProps<T>['rules'];
  onChange?: (value: boolean) => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Checkbox
          label={label}
          disabled={disabled}
          error={error?.message}
          value={!!value}
          onChange={(value) => {
            onChange(value);
            onPropsChange?.(value);
          }}
        />
      )}
    />
  );
}
