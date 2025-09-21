import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationEntranceController } from '../controller/brand-location-entrance-controller';

type FormValue = {
  entrance: string;
};

export const BrandLocationEntranceForm = ({
  entrance,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      entrance,
    },
  });

  const update = useCallback(
    (value: FormValue) => entrance !== value.entrance && onUpdate(value),
    [entrance, onUpdate],
  );

  return (
    <BrandLocationEntranceController
      name="entrance"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
