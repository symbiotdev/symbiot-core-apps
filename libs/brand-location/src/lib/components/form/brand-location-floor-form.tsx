import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationFloorController } from '../controller/brand-location-floor-controller';

type FormValue = {
  floor: string;
};

export const BrandLocationFloorForm = ({
  floor,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      floor,
    },
  });

  const update = useCallback(
    (value: FormValue) => floor !== value.floor && onUpdate(value),
    [floor, onUpdate],
  );

  return (
    <BrandLocationFloorController
      name="floor"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
