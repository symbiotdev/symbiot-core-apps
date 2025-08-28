import {
  Account,
  AccountPreferences,
  UpdateAccountData,
  useAccountMeRemoveAvatar,
  useAccountMeUpdate,
  useUpdateAccountPreferencesQuery,
} from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useCallback } from 'react';
import { Scheme, schemes } from '@symbiot-core-apps/shared';
import { useScheme } from './use-app-theme.state';
import { ImagePickerAsset } from 'expo-image-picker';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type AccountStats = {
  newNotifications?: number;
};

type CurrentAccountState = {
  me?: Account;
  stats: AccountStats;
  clear: () => void;
  setMe: (me?: Account) => void;
  setMePreferences: (preferences: Partial<AccountPreferences>) => void;
  setMeStats: (stats: AccountStats) => void;
};

export const useCurrentAccountState = create<CurrentAccountState>()(
  devtools(
    persist<CurrentAccountState>(
      (set, get) => ({
        stats: {},
        clear: () =>
          set({
            me: undefined,
            stats: {},
          }),
        setMe: (me) => set({ me }),
        setMePreferences: (preferences) => {
          const { setMe, me } = get();

          if (me) {
            setMe({
              ...me,
              preferences: {
                ...me.preferences,
                ...preferences,
              },
            });
          }
        },
        setMeStats: (newStats) => {
          const { stats } = get();

          set({
            stats: {
              ...stats,
              ...newStats,
            },
          });
        },
      }),
      {
        name: 'symbiot-current-account',
        storage: createZustandStorage(),
      },
    ),
  ),
);

export const useCurrentAccount = () => {
  const { me, stats, setMe, setMeStats } = useCurrentAccountState();
  const { setScheme } = useScheme();
  const { setMePreferences } = useCurrentAccountState();

  const updateMePreferences = useCallback(
    async (preferences: AccountPreferences) => {
      setMePreferences(preferences);

      if (preferences.scheme) {
        setScheme(
          schemes.includes(preferences.scheme as Scheme)
            ? (preferences.scheme as Scheme)
            : undefined,
        );
      }
    },
    [setMePreferences, setScheme],
  );

  return {
    updateMe: setMe,
    updateMePreferences,
    me,
    stats,
    setMeStats,
  };
};

export const useCurrentAccountUpdater = () => {
  const { me, updateMe, setMeStats, updateMePreferences } = useCurrentAccount();
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
  } = useAccountMeUpdate();
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
    async (avatar: ImagePickerAsset) =>
      updateMe(await updateAvatar({ avatar })),
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
    setMeStats,
    updating: arePreferencesUpdating || isAccountUpdating,
    updateError: updatePreferencesError || updateAccountError,
    avatarUpdating: isAvatarUpdating || isAvatarRemoving,
    avatarError: updateAvatarError || removeAvatarError,
  };
};
