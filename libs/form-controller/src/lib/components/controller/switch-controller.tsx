import { Switch } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function SwitchController<T extends FieldValues>({
  name,
  label,
  description,
  rules,
  required,
  control,
}: {
  name: Path<T>;
  control: Control<T>;
  label: string;
  description: string;
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
        <Switch
          label={label}
          description={description}
          required={required}
          checked={!!value}
          onChange={onChange}
        />
      )}
    />
  );
}
