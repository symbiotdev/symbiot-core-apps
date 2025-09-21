import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationPhonesController } from '../controller/brand-location-phones-controller';

type FormValue = {
  phones: string[];
};

export const BrandLocationPhonesForm = ({
  phones,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<{ phone: string }>({
    defaultValues: {
      phone: phones[0],
    },
  });

  const update = useCallback(
    (value: { phone: string }) =>
      phones[0] !== value.phone && onUpdate({ phones: [value.phone].filter(Boolean) }),
    [phones, onUpdate],
  );

  return (
    <BrandLocationPhonesController
      name="phone"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
