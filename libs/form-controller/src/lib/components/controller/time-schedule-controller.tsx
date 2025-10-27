import { TimeSchedule } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function TimeScheduleController<T extends FieldValues>({
  name,
  control,
  disabled,
  rules,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <TimeSchedule
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
