import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { Schedule } from '@symbiot-core-apps/api';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { BrandLocationSchedulesController } from '../controller/brand-location-schedules-controller';

type FormValue = {
  schedules: Schedule[];
};

export const BrandLocationSchedulesForm = ({
  schedules,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      schedules,
    },
  });

  const update = useCallback(
    (value: FormValue) =>
      !arraysOfObjectsEqual(schedules, value.schedules) && onUpdate(value),
    [schedules, onUpdate],
  );

  return (
    <BrandLocationSchedulesController
      disableDrag
      name="schedules"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
