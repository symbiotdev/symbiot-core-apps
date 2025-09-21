import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { AccountPhonesController } from '../controller/account-phones-controller';

type FormValue = {
  phones: string[];
};

export const AccountPhonesForm = ({
  phones,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit, setValue } = useForm<{ phone: string }>({
    defaultValues: {
      phone: phones[0],
    },
  });

  const update = useCallback(
    (value: { phone: string }) =>
      phones[0] !== value.phone &&
      onUpdate({ phones: [value.phone].filter(Boolean) }),
    [phones, onUpdate],
  );

  useEffect(() => {
    setValue('phone', phones[0]);
  }, [phones, setValue]);

  return (
    <AccountPhonesController
      name="phone"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
