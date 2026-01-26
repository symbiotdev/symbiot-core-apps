import { WeekdaySchedule, WeekdaysSchedule } from '@symbiot-core-apps/ui';
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

export function WeekdaysScheduleController<T extends FieldValues>({
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
          weekStartsOn={me?.preferences?.appearance?.calendar?.weekStartsOn}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
