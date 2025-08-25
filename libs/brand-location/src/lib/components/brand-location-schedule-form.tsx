import {
  BrandLocation,
  Schedule,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { WeekdaySchedule, WeekdaysSchedule } from '@symbiot-core-apps/ui';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';

export const BrandLocationScheduleForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { me } = useCurrentAccount();
  const { mutateAsync: update } = useUpdateBrandLocationQuery();
  const form = useBrandLocationForm();

  const { control: scheduleControl } = useForm<{
    schedules: Schedule[];
  }>({
    defaultValues: {
      schedules: location.schedules,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          schedules: form.schedules.scheme.ensure(),
        })
        .required(),
    ),
  });

  return (
    <Controller
      control={scheduleControl}
      name="schedules"
      render={({ field: { value, onChange } }) => (
        <WeekdaysSchedule
          value={value as WeekdaySchedule[]}
          weekStartsOn={me?.preferences?.weekStartsOn}
          onChange={(schedules) => {
            onChange(schedules);
            !arraysOfObjectsEqual(schedules, location.schedules) &&
              update({
                id: location.id,
                data: { schedules },
              });
          }}
        />
      )}
    />
  );
};
