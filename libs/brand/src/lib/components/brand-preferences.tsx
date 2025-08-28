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
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DateHelper } from '@symbiot-core-apps/shared';
import { Link } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';

export const BrandPreferences = () => {
  const { t } = useTranslation();
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
          name: yup
            .string()
            .required(
              t('brand.information.preferences.form.name.error.required'),
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

  const targetWebsiteLink = brand?.links?.find(APP_LINK.website.isValidLink);
  const { control: websiteControl, handleSubmit: websiteHandleSubmit } =
    useForm<{
      website: Omit<Link, 'id'> | null;
    }>({
      defaultValues: {
        website: targetWebsiteLink,
      },
      resolver: yupResolver(
        yup
          .object()
          .shape({
            website: getAppLinkSchema(
              t('brand.information.preferences.form.website.error.validation'),
            ).nullable(),
          })
          .required(),
      ),
    });

  const targetInstagramLink = brand?.links?.find(APP_LINK.instagram.isValidUrl);
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

  const updateWebsite = useCallback(
    async ({ website }: { website: Omit<Link, 'id'> | null }) => {
      if ((website?.url || '') !== (targetWebsiteLink?.url || '')) {
        brand &&
          (await updateBrand$({
            links: [
              ...brand.links.filter(
                (link) => !APP_LINK.website.isValidLink(link),
              ),
              ...(website ? [website] : []),
            ],
          }));
      }
    },
    [brand, targetWebsiteLink?.url, updateBrand$],
  );

  const updateInstagram = useCallback(
    async ({ instagram }: { instagram: Omit<Link, 'id'> | null }) => {
      if ((instagram?.url || '') !== (targetInstagramLink?.url || '')) {
        brand &&
          (await updateBrand$({
            links: [
              ...brand.links.filter(
                (link) => !APP_LINK.instagram.isValidUrl(link),
              ),
              ...(instagram ? [instagram] : []),
            ],
          }));
      }
    },
    [brand, targetInstagramLink?.url, updateBrand$],
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
          onAttach={updateAvatar$}
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
                label={t('brand.information.preferences.form.name.label')}
                placeholder={t(
                  'brand.information.preferences.form.name.placeholder',
                )}
                onChange={onChange}
                onBlur={nameHandleSubmit(updateName)}
              />
            )}
          />

          <Controller
            control={websiteControl}
            name="website"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <AppLinkInput
                type="website"
                enterKeyHint="done"
                value={value}
                label={t('brand.information.preferences.form.website.label')}
                placeholder={t(
                  'brand.information.preferences.form.website.placeholder',
                )}
                error={error?.message}
                onChange={onChange}
                onBlur={websiteHandleSubmit(updateWebsite)}
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
                label={t('brand.information.preferences.form.instagram.label')}
                placeholder={t(
                  'brand.information.preferences.form.instagram.placeholder',
                )}
                error={error?.message}
                onChange={onChange}
                onBlur={instagramHandleSubmit(updateInstagram)}
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
                label={t('brand.information.preferences.form.birthday.label')}
                placeholder={t(
                  'brand.information.preferences.form.birthday.placeholder',
                )}
                onChange={(birthday) => {
                  onChange(birthday);
                  birthdayHandleSubmit(updateBirthday)();
                }}
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
                label={t('brand.information.preferences.form.about.label')}
                placeholder={t(
                  'brand.information.preferences.form.about.placeholder',
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
