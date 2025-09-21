import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { BrandClientGenderController } from '../controller/brand-client-gender-controller';

type FormValue = {
  gender: string;
};

export const BrandClientGenderForm = ({
  gender,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      gender,
    },
  });

  const update = useCallback(
    (value: FormValue) => value.gender !== gender && onUpdate(value),
    [gender, onUpdate],
  );

  useEffect(() => {
    gender && setValue('gender', gender);
  }, [gender, setValue]);

  return (
    <BrandClientGenderController
      name="gender"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
