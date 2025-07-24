import {
  AvatarPicker,
  FormView,
  Input,
  PageView,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useMeUpdater } from '@symbiot-core-apps/store';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ImagePickerAsset } from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

  const { control } = useForm<{ firstname: string; lastname: string }>({
    defaultValues: {
      firstname: me?.firstname,
      lastname: me?.lastname,
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
        })
        .required(),
    ),
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: updating ? () => <Spinner /> : undefined,
    });
  }, [updating, navigation]);

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
                value={value}
                error={error?.message}
                disabled={updating}
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
                value={value}
                error={error?.message}
                disabled={updating}
                label={t('shared.preferences.account.lastname.label')}
                placeholder={t(
                  'shared.preferences.account.lastname.placeholder',
                )}
                onChange={onChange}
                onBlur={() => updateAccount$({ lastname: value })}
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
