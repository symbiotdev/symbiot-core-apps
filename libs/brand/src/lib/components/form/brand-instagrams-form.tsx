import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useRef } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { BrandInstagramsController } from '../contoller/brand-instagrams-controller';

type FormValue = {
  instagrams: string[];
};

export const BrandInstagramsForm = ({
  instagrams,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<{
    instagram: string | null;
  }>({
    defaultValues: {
      instagram: instagrams[0],
    },
  });

  const initialValueRef = useRef(instagrams);

  const update = useCallback(
    ({ instagram }: { instagram: string | null }) => {
      const nextValue = instagram ? [instagram] : [];

      if (!arraysOfObjectsEqual(instagrams, nextValue))
        onUpdate({ instagrams: nextValue });
    },
    [instagrams, onUpdate],
  );

  useEffect(() => {
    if (!arraysOfObjectsEqual(instagrams, initialValueRef.current)) {
      setValue('instagram', instagrams[0] || null);
      initialValueRef.current = instagrams;
    }
  }, [setValue, instagrams]);

  return (
    <BrandInstagramsController
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
