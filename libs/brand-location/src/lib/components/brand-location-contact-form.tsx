import {
  BrandLocation,
  Link,
  Phone,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { Controller, useForm } from 'react-hook-form';
import {
  APP_LINK,
  AppLinkInput,
  Input,
  PhoneInput,
} from '@symbiot-core-apps/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback } from 'react';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';

export const BrandLocationContactForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { mutateAsync: update } = useUpdateBrandLocationQuery();
  const form = useBrandLocationForm();

  const { control: phoneControl, handleSubmit: phoneHandleSubmit } = useForm<{
    phone: Phone;
  }>({
    defaultValues: {
      phone: location.phones[0],
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          phone: form.phone.optionalScheme,
        })
        .required(),
    ),
  });

  const updatePhones = useCallback(
    async ({ phone }: { phone: Phone }) => {
      const currentPhone = location.phones?.[0];

      if (
        (currentPhone?.tel && !phone.tel) ||
        (phone.tel && !currentPhone?.tel) ||
        phone.tel !== currentPhone?.tel
      ) {
        await update({
          id: location.id,
          data: {
            phones: phone.tel ? [phone] : [],
          },
        });
      }
    },
    [location.id, location.phones, update],
  );

  const { control: emailControl, handleSubmit: emailHandleSubmit } = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: location.email || '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          email: form.email.optionalScheme,
        })
        .required(),
    ),
  });

  const updateEmail = useCallback(
    ({ email }: { email: string }) => {
      email !== location.email &&
        update({
          id: location.id,
          data: {
            email,
          },
        });
    },
    [location.email, location.id, update],
  );

  const targetInstagramLink = location.links?.find(
    APP_LINK.instagram.isValidUrl,
  );
  const { control: instagramControl, handleSubmit: instagramHandleSubmit } =
    useForm<{
      instagram: Omit<Link, 'id'> | null;
    }>({
      defaultValues: {
        instagram: targetInstagramLink,
      },
      resolver: yupResolver(
        yup
          .object()
          .shape({
            instagram: form.instagram.optionalScheme,
          })
          .required(),
      ),
    });

  const updateInstagram = useCallback(
    async ({ instagram }: { instagram: Omit<Link, 'id'> | null }) => {
      if ((instagram?.url || '') !== (targetInstagramLink?.url || '')) {
        await update({
          id: location.id,
          data: {
            links: [
              ...(location.links?.filter(
                (link) => !APP_LINK.instagram.isValidUrl(link),
              ) || []),
              ...(instagram ? [instagram] : []),
            ],
          },
        });
      }
    },
    [location.id, location.links, targetInstagramLink?.url, update],
  );

  return (
    <>
      <Controller
        control={phoneControl}
        name="phone"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <PhoneInput
            enterKeyHint="done"
            value={value}
            label={form.phone.label}
            placeholder={form.phone.placeholder}
            error={error?.message}
            onChange={onChange}
            onBlur={phoneHandleSubmit(updatePhones)}
          />
        )}
      />

      <Controller
        control={emailControl}
        name="email"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <Input
            value={value}
            error={error?.message}
            enterKeyHint="next"
            type="email"
            keyboardType="email-address"
            label={form.email.label}
            placeholder={form.email.placeholder}
            onChange={onChange}
            onBlur={emailHandleSubmit(updateEmail)}
          />
        )}
      />

      <Controller
        control={instagramControl}
        name="instagram"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AppLinkInput
            autoCapitalize="none"
            type="instagram"
            value={value}
            enterKeyHint="done"
            error={error?.message}
            label={form.instagram.label}
            placeholder={form.instagram.placeholder}
            onChange={onChange}
            onBlur={instagramHandleSubmit(updateInstagram)}
          />
        )}
      />
    </>
  );
};
