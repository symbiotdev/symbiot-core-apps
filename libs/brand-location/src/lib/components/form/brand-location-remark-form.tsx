import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandLocationRemarkController } from '../controller/brand-location-remark-controller';

type FormValue = {
  remark: string;
};

export const BrandLocationRemarkForm = ({
  remark,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      remark,
    },
  });

  const update = useCallback(
    (value: FormValue) => remark !== value.remark && onUpdate(value),
    [remark, onUpdate],
  );

  return (
    <BrandLocationRemarkController
      name="remark"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
