import {
  Account,
  AccountPreferences,
  UpdateAccountData,
  useAccountMeAvatarUpdate,
  useAccountMeQuery,
  useAccountMeRemoveAvatar,
  useAccountMeUpdate,
  useUpdateAccountPreferencesQuery,
} from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect } from 'react';
import { Scheme, schemes, useRestoreApp } from '@symbiot-core-apps/shared';
import { useScheme } from './use-app-theme.state';
import { changeAppLanguage } from '@symbiot-core-apps/i18n';
import { ImagePickerAsset } from 'expo-image-picker';

type AccountMeState = {
  me?: Account;
  clear: () => void;
  setMe: (me: Account) => void;
  setMePreferences: (preferences: AccountPreferences) => void;
};

export const useAccountMeState = create<AccountMeState>()(
  devtools(
    persist<AccountMeState>(
      (set, get) => ({
        clear: () => {
          set({
            me: undefined,
          });
        },
        setMe: (me) => {
          set({ me });
        },
        setMePreferences: (preferences) => {
          const { setMe, me } = get();

          if (me) {
            setMe({
              ...me,
              preferences,
            });
          }
        },
      }),
      {
        name: 'account-me',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
);

export const useMe = () => {
  const { me, setMe } = useAccountMeState();
  const { setScheme } = useScheme();
  const { setMePreferences } = useAccountMeState();

  const updateMe = useCallback(
    (account: Account) => {
      changeAppLanguage(account.language);
      setMe(account);
    },
    [setMe],
  );

  const updateMePreferences = useCallback(
    async (preferences: AccountPreferences) => {
      setScheme(
        schemes.includes(preferences.scheme as Scheme)
          ? (preferences.scheme as Scheme)
          : undefined,
      );

      setMePreferences(preferences);
    },
    [setMePreferences, setScheme],
  );

  return {
    updateMe,
    updateMePreferences,
    me,
  };
};

export const useMeLoader = () => {
  const { me, updateMe, updateMePreferences } = useMe();
  const {
    data: meResponse,
    refetch: loadMe$,
    isPending,
    error,
  } = useAccountMeQuery();

  useEffect(() => {
    if (meResponse) {
      updateMe(meResponse);

      if (meResponse.preferences) {
        void updateMePreferences(meResponse.preferences);
      }
    }
  }, [updateMe, updateMePreferences, meResponse]);

  useRestoreApp(useCallback(() => loadMe$(), [loadMe$]));

  return {
    loadMe$,
    me,
    loading: isPending,
    loadError: error,
  };
};

export const useMeUpdater = () => {
  const { me, updateMe, updateMePreferences } = useMe();
  const {
    mutateAsync: updatePreferences,
    isPending: arePreferencesUpdating,
    error: updatePreferencesError,
  } = useUpdateAccountPreferencesQuery();
  const {
    mutateAsync: updateAccount,
    isPending: isAccountUpdating,
    error: updateAccountError,
  } = useAccountMeUpdate();
  const {
    mutateAsync: updateAvatar,
    isPending: isAvatarUpdating,
    error: updateAvatarError,
  } = useAccountMeAvatarUpdate();
  const {
    mutateAsync: removeAvatar,
    isPending: isAvatarRemoving,
    error: removeAvatarError,
  } = useAccountMeRemoveAvatar();

  const updateAccount$ = useCallback(
    async (data: UpdateAccountData) => updateMe(await updateAccount(data)),
    [updateMe, updateAccount],
  );

  const updateAvatar$ = useCallback(
    async (image: ImagePickerAsset) => updateMe(await updateAvatar(image)),
    [updateAvatar, updateMe],
  );

  const removeAvatar$ = useCallback(
    async () => updateMe(await removeAvatar()),
    [removeAvatar, updateMe],
  );

  const updatePreferences$ = useCallback(
    async (data: Partial<AccountPreferences>) => {
      const initialPreferences = me?.preferences;

      try {
        if (initialPreferences) {
          void updateMePreferences({
            ...initialPreferences,
            ...data,
          });
        }

        const preferences = await updatePreferences(data);

        await updateMePreferences(preferences);
      } catch {
        if (initialPreferences) {
          void updateMePreferences(initialPreferences);
        }
      }
    },
    [updateMePreferences, me?.preferences, updatePreferences],
  );

  return {
    updateAccount$,
    updatePreferences$,
    updateAvatar$,
    removeAvatar$,
    me,
    updating: arePreferencesUpdating || isAccountUpdating,
    updateError: updatePreferencesError || updateAccountError,
    avatarUpdating: isAvatarUpdating || isAvatarRemoving,
    avatarError: updateAvatarError || removeAvatarError,
  };
};
