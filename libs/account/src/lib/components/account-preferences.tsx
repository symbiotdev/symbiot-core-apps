import {
  AvatarPicker,
  ContextMenuItem,
  ContextMenuPopover,
  DatePicker,
  FormView,
  getPhoneInputSchema,
  Icon,
  Input,
  PageView,
  phoneDefaultValue,
  PhoneInput,
} from '@symbiot-core-apps/ui';
import { useMeUpdater } from '@symbiot-core-apps/store';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePickerAsset } from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { router } from 'expo-router';
import { Phone } from '@symbiot-core-apps/api';

export const AccountPreferences = () => {
  const navigation = useNavigation();
  const {
    me,
    updateAccount$,
    updateAvatar$,
    removeAvatar$,
    updating,
    avatarUpdating,
  } = useMeUpdater();
  const { t } = useTranslation();

  const onAttach = useCallback(
    (images: ImagePickerAsset[]) => updateAvatar$(images[0]),
    [updateAvatar$],
  );

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        label: t(
          'shared.preferences.account.context_menu.remove_account.label',
        ),
        icon: <Icon.Dynamic type="Ionicons" name="trash-outline" />,
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

  const { control: phoneControl, handleSubmit: phoneHandleSubmit } = useForm<{
    phone: Phone;
  }>({
    defaultValues: {
      phone: me?.phones?.[0] || phoneDefaultValue,
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

  const updatePhones = useCallback(
    async ({ phone }: { phone: Phone }) => {
      if (phone.tel !== me?.phones?.[0]?.tel) {
        await updateAccount$({ phones: phone.tel ? [phone] : [] });
      }
    },
    [me?.phones, updateAccount$],
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
          onAttach={onAttach}
          onRemove={removeAvatar$}
        />

        <FormView>
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
                value={value}
                error={error?.message}
                label={t('shared.preferences.account.firstname.label')}
                placeholder={t(
                  'shared.preferences.account.firstname.placeholder',
                )}
                onChange={onChange}
                onBlur={firstnameHandleSubmit(updateAccount$)}
              />
            )}
          />

          <Controller
            control={lastnameControl}
            name="lastname"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                autoCapitalize="words"
                value={value}
                error={error?.message}
                label={t('shared.preferences.account.lastname.label')}
                placeholder={t(
                  'shared.preferences.account.lastname.placeholder',
                )}
                onChange={onChange}
                onBlur={lastnameHandleSubmit(updateAccount$)}
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
                maxDate={new Date()}
                label={t('shared.preferences.account.birthday.label')}
                placeholder={t(
                  'shared.preferences.account.birthday.placeholder',
                )}
                onChange={(birthday) => {
                  onChange(birthday);
                  birthdayHandleSubmit(updateAccount$)();
                }}
              />
            )}
          />

          <Controller
            control={phoneControl}
            name="phone"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <PhoneInput
                value={value}
                label={t('shared.preferences.account.phone.label')}
                placeholder={t('shared.preferences.account.phone.placeholder')}
                enterKeyHint="next"
                error={error?.message}
                onChange={onChange}
                onBlur={phoneHandleSubmit(updatePhones)}
              />
            )}
          />
        </FormView>
      </PageView>
    )
  );
};
