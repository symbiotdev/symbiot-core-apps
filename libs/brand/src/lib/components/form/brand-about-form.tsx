import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { BrandAboutController } from '../contoller/brand-about-controller';

type FormValue = {
  about: string;
};

export const BrandAboutForm = ({
  about = '',
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      about,
    },
  });

  const update = useCallback(
    (value: FormValue) => {
      value.about !== about && onUpdate(value);
    },
    [about, onUpdate],
  );

  useEffect(() => {
    setValue('about', about);
  }, [about, setValue]);

  return (
    <BrandAboutController control={control} onBlur={handleSubmit(update)} />
  );
};
