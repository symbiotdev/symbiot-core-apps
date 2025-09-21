import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { BrandClientAddressController } from '../controller/brand-client-address-controller';

type FormValue = {
  addresses: string[];
};

export const BrandClientAddressesForm = ({
  addresses,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<{ address: string }>({
    defaultValues: {
      address: addresses[0],
    },
  });

  const update = useCallback(
    (value: { address: string }) =>
      addresses[0] !== value.address &&
      onUpdate({ addresses: [value.address].filter(Boolean) }),
    [addresses, onUpdate],
  );

  useEffect(() => {
    setValue('address', addresses[0]);
  }, [addresses, setValue]);

  return (
    <BrandClientAddressController
      name="address"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
