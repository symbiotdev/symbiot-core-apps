import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { useCurrentAccountPreferences } from '@symbiot-core-apps/state';
import {
  WeekdaySchedule,
  WeekdaysSchedule,
} from '../form-element/weekdays-schedule';

export function WeekdaysScheduleController<T extends FieldValues>({
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
  const preferences = useCurrentAccountPreferences();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <WeekdaysSchedule
          disabled={disabled}
          value={value as WeekdaySchedule[]}
          weekStartsOn={preferences.appearance?.calendar?.weekStartsOn}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    />
  );
}
