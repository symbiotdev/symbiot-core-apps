import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { BrandLocationAdvantagesController } from '../controller/brand-location-advantages-controller';

type FormValue = {
  advantages: string[];
};

export const BrandLocationAdvantagesForm = ({
  advantages,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, getValues } = useForm<FormValue>({
    defaultValues: {
      advantages,
    },
  });

  useEffect(() => {
    return () => {
      const newAdvantages = getValues('advantages');

      if (!arraysOfObjectsEqual(advantages, newAdvantages)) {
        onUpdate({ advantages: newAdvantages });
      }
    };
  }, [advantages, getValues, onUpdate]);

  return (
    <BrandLocationAdvantagesController
      noLabel
      name="advantages"
      control={control}
    />
  );
};
