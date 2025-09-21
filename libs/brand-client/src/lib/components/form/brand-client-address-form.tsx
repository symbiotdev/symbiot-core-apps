import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { BrandClientAddressController } from '../controller/brand-client-address-controller';

type FormValue = {
  address: string;
};

export const BrandClientAddressForm = ({
  address,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<FormValue>({
    defaultValues: {
      address,
    },
  });

  const update = useCallback(
    (value: FormValue) => value.address !== address && onUpdate(value),
    [address, onUpdate],
  );

  useEffect(() => {
    address && setValue('address', address);
  }, [address, setValue]);

  return (
    <BrandClientAddressController
      name="address"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
