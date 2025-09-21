import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationEmailsController } from '../controller/brand-location-emails-controller';

type FormValue = {
  emails: string[];
};

export const BrandLocationEmailsForm = ({
  emails,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<{ email: string }>({
    defaultValues: {
      email: emails[0],
    },
  });

  const update = useCallback(
    (value: { email: string }) =>
      emails[0] !== value.email && onUpdate({ emails: [value.email].filter(Boolean) }),
    [emails, onUpdate],
  );

  return (
    <BrandLocationEmailsController
      name="email"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
