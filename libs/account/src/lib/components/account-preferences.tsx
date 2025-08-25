import {
  APP_LINK,
  AppLinkInput,
  AvatarPicker,
  DatePicker,
  FormView,
  getAppLinkSchema,
  getPhoneInputSchema,
  Input,
  PageView,
  phoneDefaultValue,
  PhoneInput,
  SelectPicker,
} from '@symbiot-core-apps/ui';
import { useCurrentAccountUpdater, useGenders } from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, Phone } from '@symbiot-core-apps/api';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useTranslation } from 'react-i18next';

export const AccountPreferences = () => {
  const { me, updateAccount$, updateAvatar$, removeAvatar$, avatarUpdating } =
    useCurrentAccountUpdater();
  const { t } = useTranslation();
  const {
    gendersAsOptions,
    loading: gendersLoading,
    error: gendersError,
  } = useGenders();

  const { control: firstnameControl, handleSubmit: firstnameHandleSubmit } =
    useForm<{
      firstname: string;
    }>({
      defaultValues: {
        firstname: me?.firstname,
      },
      resolver: yupResolver(
        yup
          .object()
          .shape({
            firstname: yup
              .string()
              .required(
                t('shared.preferences.account.firstname.error.required'),
              ),
          })
          .required(),
      ),
    });

  const { control: lastnameControl, handleSubmit: lastnameHandleSubmit } =
    useForm<{
      lastname: string;
    }>({
      defaultValues: {
        lastname: me?.lastname,
      },
      resolver: yupResolver(
        yup
          .object()
          .shape({
            lastname: yup
              .string()
              .required(
                t('shared.preferences.account.lastname.error.required'),
              ),
          })
          .required(),
      ),
    });

  const { control: genderControl, handleSubmit: genderHandleSubmit } = useForm<{
    genderId: string | null;
  }>({
    defaultValues: {
      genderId: me?.gender?.id,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          genderId: yup.string().nullable().default(null),
        })
        .required(),
    ),
  });

  const { control: birthdayControl, handleSubmit: birthdayHandleSubmit } =
    useForm<{
      birthday: Date | null;
    }>({
      defaultValues: {
        birthday: me?.birthday,
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

  const targetPhone = me?.phones?.[0];
  const { control: phoneControl, handleSubmit: phoneHandleSubmit } = useForm<{
    phone: Phone;
  }>({
    defaultValues: {
      phone: targetPhone || phoneDefaultValue,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          phone: getPhoneInputSchema(
            t('shared.preferences.account.phone.error.invalid'),
            true,
          ),
        })
        .required(),
    ),
  });

  const targetInstagramLink = me?.links?.find(APP_LINK.instagram.isValidUrl);
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

  const updateFirstname = useCallback(
    ({ firstname }: { firstname: string }) =>
      me?.firstname !== firstname && updateAccount$({ firstname }),
    [me?.firstname, updateAccount$],
  );

  const updateLastname = useCallback(
    ({ lastname }: { lastname: string }) =>
      me?.lastname !== lastname && updateAccount$({ lastname }),
    [me?.lastname, updateAccount$],
  );

  const updateGender = useCallback(
    ({ genderId }: { genderId: string | null }) =>
      me?.gender?.id !== genderId && updateAccount$({ genderId }),
    [me?.gender, updateAccount$],
  );

  const updateBirthday = useCallback(
    ({ birthday }: { birthday: Date | null }) =>
      me?.birthday !== birthday &&
      updateAccount$({ birthday: birthday?.toISOString() }),
    [me?.birthday, updateAccount$],
  );

  const updatePhones = useCallback(
    async ({ phone }: { phone: Phone }) => {
      if (
        (targetPhone?.tel && !phone.tel) ||
        (phone.tel && !targetPhone?.tel) ||
        phone.tel !== targetPhone?.tel
      ) {
        await updateAccount$({ phones: phone.tel ? [phone] : [] });
      }
    },
    [targetPhone?.tel, updateAccount$],
  );

  const updateInstagram = useCallback(
    async ({ instagram }: { instagram: Omit<Link, 'id'> | null }) => {
      if ((instagram?.url || '') !== (targetInstagramLink?.url || '')) {
        await updateAccount$({ links: instagram ? [instagram] : [] });
      }
    },
    [targetInstagramLink?.url, updateAccount$],
  );

  return (
    me && (
      <PageView scrollable withHeaderHeight withKeyboard gap="$5">
        <AvatarPicker
          alignSelf="center"
          loading={avatarUpdating}
          name={me.name}
          color={me.avatarColor}
          url={me.avatarUrl}
          removable={!!me.avatarUrl}
          size={100}
          onAttach={updateAvatar$}
          onRemove={removeAvatar$}
        />

        <FormView gap="$5">
          <Input
            disabled
            value={me.email}
            label={t('shared.preferences.account.email.label')}
          />

          <Controller
            control={firstnameControl}
            name="firstname"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                autoCapitalize="words"
                enterKeyHint="done"
                value={value}
                error={error?.message}
                label={t('shared.preferences.account.firstname.label')}
                placeholder={t(
                  'shared.preferences.account.firstname.placeholder',
                )}
                onChange={onChange}
                onBlur={firstnameHandleSubmit(updateFirstname)}
              />
            )}
          />

          <Controller
            control={lastnameControl}
            name="lastname"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                autoCapitalize="words"
                enterKeyHint="done"
                value={value}
                error={error?.message}
                label={t('shared.preferences.account.lastname.label')}
                placeholder={t(
                  'shared.preferences.account.lastname.placeholder',
                )}
                onChange={onChange}
                onBlur={lastnameHandleSubmit(updateLastname)}
              />
            )}
          />

          <Controller
            control={genderControl}
            name="genderId"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <SelectPicker
                value={value as string}
                error={error?.message}
                optionsLoading={gendersLoading}
                optionsError={gendersError}
                options={gendersAsOptions}
                label={t('shared.preferences.account.gender.label')}
                sheetLabel={t('shared.preferences.account.gender.label')}
                placeholder={t('shared.preferences.account.gender.placeholder')}
                onChange={(gender) => {
                  onChange(gender);
                  genderHandleSubmit(updateGender)();
                }}
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
                minDate={DateHelper.addYears(new Date(), -100)}
                maxDate={new Date()}
                label={t('shared.preferences.account.birthday.label')}
                placeholder={t(
                  'shared.preferences.account.birthday.placeholder',
                )}
                onChange={(birthday) => {
                  onChange(birthday);
                  birthdayHandleSubmit(updateBirthday)();
                }}
              />
            )}
          />

          <Controller
            control={phoneControl}
            name="phone"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <PhoneInput
                enterKeyHint="done"
                value={value}
                label={t('shared.preferences.account.phone.label')}
                placeholder={t('shared.preferences.account.phone.placeholder')}
                error={error?.message}
                onChange={onChange}
                onBlur={phoneHandleSubmit(updatePhones)}
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
                label={t('shared.preferences.account.instagram.label')}
                placeholder={t(
                  'shared.preferences.account.instagram.placeholder',
                )}
                error={error?.message}
                onChange={onChange}
                onBlur={instagramHandleSubmit(updateInstagram)}
              />
            )}
          />
        </FormView>
      </PageView>
    )
  );
};
