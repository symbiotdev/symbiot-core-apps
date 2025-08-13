import {
  APP_LINK,
  AppLinkInput,
  AvatarPicker,
  ContextMenuItem,
  ContextMenuPopover,
  DatePicker,
  FormView,
  getAppLinkSchema,
  getPhoneInputSchema,
  Icon,
  Input,
  PageView,
  phoneDefaultValue,
  PhoneInput,
  SelectPicker,
} from '@symbiot-core-apps/ui';
import { useCurrentAccountUpdater, useGenders } from '@symbiot-core-apps/state';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { router } from 'expo-router';
import { Link, Phone } from '@symbiot-core-apps/api';
import { useT } from '@symbiot-core-apps/i18n';
import { DateHelper } from '@symbiot-core-apps/shared';

export const AccountPreferences = () => {
  const navigation = useNavigation();
  const {
    me,
    updateAccount$,
    updateAvatar$,
    removeAvatar$,
    updating,
    avatarUpdating,
  } = useCurrentAccountUpdater();
  const { t } = useT();
  const {
    gendersAsOptions,
    loading: gendersLoading,
    error: gendersError,
  } = useGenders();

  const onAttach = useCallback(
    (images: ImagePickerAsset[]) => updateAvatar$(images[0]),
    [updateAvatar$],
  );

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t('preferences.account.context_menu.remove_account.label'),
        icon: <Icon name="TrashBinMinimalistic" />,
        color: '$error',
        onPress: () => router.push('/preferences/account/remove'),
      },
    ],
    [t],
  );

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
              .required(t('preferences.account.firstname.error.required')),
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
              .required(t('preferences.account.lastname.error.required')),
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
            t('preferences.account.phone.error.invalid'),
            true,
          ),
        })
        .required(),
    ),
  });

  const targetInstagramLink = me?.links?.find(
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ContextMenuPopover
          items={contextMenuItems}
          loading={updating}
          disabled={updating}
        />
      ),
    });
  }, [updating, navigation, contextMenuItems]);

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
          onAttach={onAttach}
          onRemove={removeAvatar$}
        />

        <FormView>
          <Input
            disabled
            value={me.email}
            label={t('preferences.account.email.label')}
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
                label={t('preferences.account.firstname.label')}
                placeholder={t('preferences.account.firstname.placeholder')}
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
                label={t('preferences.account.lastname.label')}
                placeholder={t('preferences.account.lastname.placeholder')}
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
                label={t('preferences.account.gender.label')}
                sheetLabel={t('preferences.account.gender.label')}
                placeholder={t('preferences.account.gender.placeholder')}
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
                label={t('preferences.account.birthday.label')}
                placeholder={t('preferences.account.birthday.placeholder')}
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
                label={t('preferences.account.phone.label')}
                placeholder={t('preferences.account.phone.placeholder')}
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
                label={t('preferences.account.instagram.label')}
                placeholder={t('preferences.account.instagram.placeholder')}
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
