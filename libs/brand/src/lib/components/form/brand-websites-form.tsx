import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { BrandWebsitesController } from '../contoller/brand-websites-controller';

type FormValue = {
  websites: string[];
};

export const BrandWebsitesForm = ({
  websites,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<{
    website: string | null;
  }>({
    defaultValues: {
      website: websites[0],
    },
  });

  const update = useCallback(
    ({ website }: { website: string | null }) => {
      const nextValue = website ? [website] : [];

      if (!arraysOfObjectsEqual(websites, nextValue))
        onUpdate({ websites: nextValue });
    },
    [onUpdate, websites],
  );

  useEffect(() => {
    setValue('website', websites[0] || null);
  }, [setValue, websites]);

  return (
    <BrandWebsitesController
      name="website"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
