import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';
import {
  BrandLocation,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { Input } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';

export const BrandLocationPersonalityForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { mutateAsync: update } = useUpdateBrandLocationQuery();
  const form = useBrandLocationForm();

  const { control: nameControl, handleSubmit: nameHandleSubmit } = useForm<{
    name: string;
  }>({
    defaultValues: {
      name: location.name,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          name: form.name.scheme,
        })
        .required(),
    ),
  });

  const updateName = useCallback(
    ({ name }: { name: string }) => {
      name !== location.name &&
        update({
          id: location.id,
          data: { name },
        });
    },
    [location.id, location.name, update],
  );

  return (
    <Controller
      control={nameControl}
      name="name"
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Input
          autoCapitalize="words"
          enterKeyHint="done"
          value={value}
          error={error?.message}
          label={form.name.label}
          placeholder={form.name.placeholder}
          onChange={onChange}
          onBlur={nameHandleSubmit(updateName)}
        />
      )}
    />
  );
};
