import { BrandLocationAddressController } from '../controller/brand-location-address-controller';
import { useForm } from 'react-hook-form';
import { useCallback } from 'react';

type FormValue = {
  address: string;
};

export const BrandLocationAddressForm = ({
  address,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      address,
    },
  });

  const update = useCallback(
    (value: FormValue) => address !== value.address && onUpdate(value),
    [address, onUpdate],
  );

  return (
    <BrandLocationAddressController
      noLabel
      name="address"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
