import {
  APP_LINK,
  AppLinkInput,
  AvatarPicker,
  DatePicker,
  FormView,
  getAppLinkSchema,
  Input,
  PageView,
  Textarea,
} from '@symbiot-core-apps/ui';
import {
  useCurrentAccount,
  useCurrentBrandUpdater,
} from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useT } from '@symbiot-core-apps/i18n';
import { DateHelper } from '@symbiot-core-apps/shared';
import { Link } from '@symbiot-core-apps/api';

export const BrandPreferences = () => {
  const { t } = useT();
  const { me } = useCurrentAccount();
  const { brand, updateBrand$, updateAvatar$, avatarUpdating } =
    useCurrentBrandUpdater();

  const { control: nameControl, handleSubmit: nameHandleSubmit } = useForm<{
    name: string;
  }>({
    defaultValues: {
      name: brand?.name,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          name: yup.string().required(
            t('brand.information.preferences.form.name.error.required', {
              ns: 'app',
            }),
          ),
        })
        .required(),
    ),
  });

  const { control: birthdayControl, handleSubmit: birthdayHandleSubmit } =
    useForm<{
      birthday: Date | null;
    }>({
      defaultValues: {
        birthday: brand?.birthday,
      },
      resolver: yupResolver(
        yup
          .object()
          .shape({
            birthday: yup.date().nullable().optional().default(null),
          })
          .required(),
      ),
    });

  const targetInstagramLink = brand?.links?.find(
    (link) => link.url.indexOf(APP_LINK.instagram.domain) !== -1,
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
            instagram: getAppLinkSchema('', true).nullable(),
          })
          .required(),
      ),
    });

  const { control: aboutControl, handleSubmit: aboutHandleSubmit } = useForm<{
    about: string;
  }>({
    defaultValues: {
      about: brand?.about,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          about: yup.string().nullable().ensure(),
        })
        .required(),
    ),
  });

  const onAttach = useCallback(
    (images: ImagePickerAsset[]) => updateAvatar$(images[0]),
    [updateAvatar$],
  );

  const updateName = useCallback(
    ({ name }: { name: string }) =>
      brand?.name !== name && updateBrand$({ name }),
    [brand?.name, updateBrand$],
  );

  const updateAbout = useCallback(
    ({ about }: { about: string }) =>
      brand?.about !== about && updateBrand$({ about }),
    [brand?.about, updateBrand$],
  );

  const updateBirthday = useCallback(
    ({ birthday }: { birthday: Date | null }) =>
      me?.birthday !== birthday &&
      updateBrand$({ birthday: birthday?.toISOString() }),
    [me?.birthday, updateBrand$],
  );

  const updateInstagram = useCallback(
    async ({ instagram }: { instagram: Omit<Link, 'id'> | null }) => {
      if ((instagram?.url || '') !== (targetInstagramLink?.url || '')) {
        await updateBrand$({ links: instagram ? [instagram] : [] });
      }
    },
    [targetInstagramLink?.url, updateBrand$],
  );

  return (
    brand &&
    me && (
      <PageView scrollable withHeaderHeight withKeyboard gap="$5">
        <AvatarPicker
          alignSelf="center"
          loading={avatarUpdating}
          name={brand.name}
          color={brand.avatarColor}
          url={brand.avatarUrl}
          size={100}
          onAttach={onAttach}
        />

        <FormView>
          <Controller
            control={nameControl}
            name="name"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                autoCapitalize="words"
                enterKeyHint="done"
                value={value}
                error={error?.message}
                label={t('brand.information.preferences.form.name.label', {
                  ns: 'app',
                })}
                placeholder={t(
                  'brand.information.preferences.form.name.placeholder',
                  { ns: 'app' },
                )}
                onChange={onChange}
                onBlur={nameHandleSubmit(updateName)}
              />
            )}
          />

          <Controller
            control={birthdayControl}
            name="birthday"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <DatePicker
                value={value}
                error={error?.message}
                formatStr={me.preferences?.dateFormat}
                weekStartsOn={me.preferences?.weekStartsOn}
                minDate={DateHelper.addYears(new Date(), -500)}
                maxDate={new Date()}
                label={t('brand.information.preferences.form.birthday.label', {
                  ns: 'app',
                })}
                placeholder={t(
                  'brand.information.preferences.form.birthday.placeholder',
                  { ns: 'app' },
                )}
                onChange={(birthday) => {
                  onChange(birthday);
                  birthdayHandleSubmit(updateBirthday)();
                }}
              />
            )}
          />

          <Controller
            control={instagramControl}
            name="instagram"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <AppLinkInput
                type="instagram"
                enterKeyHint="done"
                value={value}
                label={t('brand.information.preferences.form.instagram.label', {
                  ns: 'app',
                })}
                placeholder={t(
                  'brand.information.preferences.form.instagram.placeholder',
                  { ns: 'app' },
                )}
                error={error?.message}
                onChange={onChange}
                onBlur={instagramHandleSubmit(updateInstagram)}
              />
            )}
          />

          <Controller
            control={aboutControl}
            name="about"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Textarea
                countCharacters
                enterKeyHint="done"
                value={value}
                error={error?.message}
                label={t('brand.information.preferences.form.about.label', {
                  ns: 'app',
                })}
                placeholder={t(
                  'brand.information.preferences.form.about.placeholder',
                  { ns: 'app' },
                )}
                onChange={onChange}
                onBlur={aboutHandleSubmit(updateAbout)}
              />
            )}
          />
        </FormView>
      </PageView>
    )
  );
};
