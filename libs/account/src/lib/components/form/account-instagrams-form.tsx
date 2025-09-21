import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { AccountInstagramsController } from '../controller/account-instagrams-controller';

type FormValue = {
  instagrams: string[];
};

export const AccountInstagramsForm = ({
  instagrams,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<{ instagram: string }>({
    defaultValues: {
      instagram: instagrams[0],
    },
  });

  const update = useCallback(
    (value: { instagram: string }) =>
      instagrams[0] !== value.instagram &&
      onUpdate({ instagrams: [value.instagram].filter(Boolean) }),
    [instagrams, onUpdate],
  );

  return (
    <AccountInstagramsController
      name="instagram"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
