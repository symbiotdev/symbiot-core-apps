import { Textarea } from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import {
  BrandLocation,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback } from 'react';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';

export const BrandLocationAdditionalInfo = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { mutateAsync: update } = useUpdateBrandLocationQuery();
  const form = useBrandLocationForm();

  const { control: remarkControl, handleSubmit: remarkHandleSubmit } = useForm<{
    remark: string;
  }>({
    defaultValues: {
      remark: location.remark || '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          remark: form.remark.optionalScheme,
        })
        .required(),
    ),
  });

  const updateRemark = useCallback(
    ({ remark }: { remark: string }) => {
      remark !== location.remark &&
        update({
          id: location.id,
          data: {
            remark,
          },
        });
    },
    [location.remark, location.id, update],
  );

  return (
    <Controller
      control={remarkControl}
      name="remark"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Textarea
          countCharacters
          enterKeyHint="done"
          value={value}
          error={error?.message}
          placeholder={form.remark.subtitle}
          onChange={onChange}
          onBlur={remarkHandleSubmit(updateRemark)}
        />
      )}
    />
  );
};
