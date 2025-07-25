import {
  AvatarPicker,
  ContextMenuItem,
  ContextMenuPopover,
  DatePicker,
  FormView,
  Icon,
  Input,
  PageView,
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
        onPress: () => router.push('/preferences/account/remove')
      },
    ],
    [t],
  );

  const { control } = useForm<{
    firstname: string;
    lastname: string;
    birthday: Date | null;
  }>({
    defaultValues: {
      firstname: me?.firstname,
      lastname: me?.lastname,
      birthday: me?.birthday,
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          firstname: yup
            .string()
            .required(t('shared.preferences.account.firstname.error.required')),
          lastname: yup
            .string()
            .required(t('shared.preferences.account.lastname.error.required')),
          birthday: yup.date().nullable().optional().default(null),
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
          <Controller
            control={control}
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
                onBlur={() => updateAccount$({ firstname: value })}
              />
            )}
          />

          <Controller
            control={control}
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
                onBlur={() => updateAccount$({ lastname: value })}
              />
            )}
          />

          <Controller
            control={control}
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
                  void updateAccount$({ birthday });
                }}
              />
            )}
          />

          <Input
            disabled
            value={me.email}
            label={t('shared.preferences.account.email.label')}
          />
        </FormView>
      </PageView>
    )
  );
};
