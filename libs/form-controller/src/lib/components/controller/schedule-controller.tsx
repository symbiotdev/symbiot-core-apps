import { WeekdaySchedule, WeekdaysSchedule } from '@symbiot-core-apps/ui';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import type { ControllerProps } from 'react-hook-form/dist/types';

export function ScheduleController<T extends FieldValues>({
  name,
  control,
  disabled,
  disableDrag,
  rules,
  onBlur,
}: {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  disableDrag?: boolean;
  rules?: ControllerProps<T>['rules'];
  onBlur?: () => void;
}) {
  const { me } = useCurrentAccountState();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <WeekdaysSchedule
          disabled={disabled}
          disableDrag={disableDrag}
          value={value as WeekdaySchedule[]}
          weekStartsOn={me?.preferences?.weekStartsOn}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
