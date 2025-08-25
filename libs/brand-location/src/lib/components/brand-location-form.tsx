import {
  APP_LINK,
  AppLinkInput,
  AvatarPicker,
  CountryPicker,
  CurrencyPicker,
  FormView,
  H3,
  Input,
  PageView,
  PhoneInput,
  Textarea,
  TimezonePicker,
  UsStatePicker,
  WeekdaySchedule,
  WeekdaysSchedule,
} from '@symbiot-core-apps/ui';
import {
  BrandLocation,
  Link,
  Phone,
  Schedule,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import {
  useCurrentAccount,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { useTranslation } from 'react-i18next';
import { View } from 'tamagui';
import { CountryCode } from 'countries-and-timezones';

export const BrandLocationForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
  const { brand } = useCurrentBrandState();
  const { mutateAsync: updateAvatar, isPending: avatarUpdating } =
    useUpdateBrandLocationQuery();
  const { mutateAsync: update } = useUpdateBrandLocationQuery();
  const form = useBrandLocationForm();

  const onAttach = useCallback(
    (images: ImagePickerAsset[]) =>
      updateAvatar({
        id: location.id,
        data: {
          avatar: images[0],
        },
      }),
    [location.id, updateAvatar],
  );

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

  const { control: countryControl, watch: countryWatch } = useForm<{
    country: string;
  }>({
    defaultValues: {
      country: location.country,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          country: form.country.scheme,
        })
        .required(),
    ),
  });

  const { control: usStateControl } = useForm<{
    usState: string;
  }>({
    defaultValues: {
      usState: location.usState,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          usState: form.usState.scheme,
        })
        .required(),
    ),
  });

  const { control: currencyControl } = useForm<{
    currency: string;
  }>({
    defaultValues: {
      currency: location.currency,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          currency: form.currency.scheme,
        })
        .required(),
    ),
  });

  const { control: timezoneControl } = useForm<{
    timezone: string;
  }>({
    defaultValues: {
      timezone: location.timezone,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          timezone: form.timezone.scheme,
        })
        .required(),
    ),
  });

  const { control: scheduleControl } = useForm<{
    schedules: Schedule[];
  }>({
    defaultValues: {
      schedules: location.schedules,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          schedules: form.schedules.scheme.ensure(),
        })
        .required(),
    ),
  });

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
    <PageView scrollable withHeaderHeight gap="$5">
      <AvatarPicker
        alignSelf="center"
        loading={avatarUpdating}
        name={location.name}
        color={brand?.avatarColor}
        url={location.avatarUrl || brand?.avatarUrl}
        size={100}
        onAttach={onAttach}
      />

      <FormView gap="$10">
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

        <View gap="$3">
          <H3 marginBottom="$2">{t('shared.locale')}</H3>

          <Controller
            control={countryControl}
            name="country"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <CountryPicker
                value={value as CountryCode}
                error={error?.message}
                label={form.country.label}
                sheetLabel={form.country.sheetLabel}
                placeholder={form.country.placeholder}
                onChange={(country) => {
                  onChange(country);
                  country !== location.country &&
                    update({
                      id: location.id,
                      data: { country },
                    });
                }}
              />
            )}
          />

          {countryWatch().country?.toLowerCase() === 'us' && (
            <Controller
              control={usStateControl}
              name="usState"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <UsStatePicker
                  value={value as string}
                  error={error?.message}
                  label={form.usState.label}
                  sheetLabel={form.usState.sheetLabel}
                  placeholder={form.usState.placeholder}
                  onChange={(usState) => {
                    onChange(usState);
                    usState !== location.usState &&
                      update({
                        id: location.id,
                        data: { usState },
                      });
                  }}
                />
              )}
            />
          )}

          <Controller
            control={timezoneControl}
            name="timezone"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TimezonePicker
                onlyCountryTimezones
                country={countryWatch().country as CountryCode}
                value={value}
                error={error?.message}
                label={form.timezone.label}
                sheetLabel={form.timezone.sheetLabel}
                placeholder={form.timezone.placeholder}
                onChange={(timezone) => {
                  onChange(timezone);
                  timezone !== location.timezone &&
                    update({
                      id: location.id,
                      data: { timezone },
                    });
                }}
              />
            )}
          />

          <Controller
            control={currencyControl}
            name="currency"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <CurrencyPicker
                value={value as string}
                error={error?.message}
                label={form.currency.label}
                sheetLabel={form.currency.sheetLabel}
                placeholder={form.currency.placeholder}
                onChange={(currency) => {
                  onChange(currency);
                  currency !== location.currency &&
                    update({
                      id: location.id,
                      data: { currency },
                    });
                }}
              />
            )}
          />
        </View>

        <View gap="$3">
          <H3 marginBottom="$2">{t('shared.contact_information')}</H3>

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
        </View>

        <View gap="$3">
          <H3 marginBottom="$2">{form.schedules.title}</H3>

          <Controller
            control={scheduleControl}
            name="schedules"
            render={({ field: { value, onChange } }) => (
              <WeekdaysSchedule
                value={value as WeekdaySchedule[]}
                weekStartsOn={me?.preferences?.weekStartsOn}
                onChange={(schedules) => {
                  onChange(schedules);
                  !arraysOfObjectsEqual(schedules, location.schedules) &&
                    update({
                      id: location.id,
                      data: { schedules },
                    });
                }}
              />
            )}
          />
        </View>

        <View gap="$3">
          <H3 marginBottom="$2">{form.remark.title}</H3>

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
        </View>
      </FormView>
    </PageView>
  );
};
