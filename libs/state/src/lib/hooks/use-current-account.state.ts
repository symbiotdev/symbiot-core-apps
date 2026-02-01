import {
  Account,
  AccountPreferences,
  AccountSubscription,
  UpdateAccountData,
  useAccountMeRemoveAvatarReq,
  useAccountMeUpdateReq,
  useUpdateAccountMePreferencesReq,
} from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCallback, useMemo } from 'react';
import { createZustandStorage, systemSchemes } from '@symbiot-core-apps/shared';
import { useAppSchemeState } from './use-app-theme.state';
import { ImagePickerAsset } from 'expo-image-picker';
import { Appearance, Platform } from 'react-native';
import merge from 'deepmerge';

type AccountStats = {
  newNotifications?: number;
};

type CurrentAccountState = {
  me?: Account;
  stats: AccountStats;
  clear: () => void;
  setMe: (me?: Account) => void;
  setMyPreferences: (preferences: Partial<AccountPreferences>) => void;
  setMySubscriptions: (subscriptions: AccountSubscription[]) => void;
  setMyStats: (stats: AccountStats) => void;
};

export const useCurrentAccountState = create<CurrentAccountState>()(
  persist<CurrentAccountState>(
    (set, get) => ({
      stats: {},
      clear: () =>
        set({
          me: undefined,
          stats: {},
        }),
      setMe: (me) => set({ me }),
      setMyPreferences: (preferences) => {
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
      setMySubscriptions: (subscriptions) => {
        const { setMe, me } = get();

        if (me) {
          setMe({
            ...me,
            subscriptions,
          });
        }
      },
      setMyStats: (newStats) => {
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
);

export const useCurrentAccountPreferences = (): AccountPreferences => {
  const { me } = useCurrentAccountState();

  return useMemo(
    () =>
      merge(
        {
          timeFormat: 'p',
          appearance: {
            date: {
              element: null,
            },
          },
        } as AccountPreferences,
        me?.preferences || {},
      ),
    [me?.preferences],
  );
};

export const useCurrentAccount = () => {
  const { me, stats, setMe, setMyStats, setMySubscriptions } =
    useCurrentAccountState();
  const { setScheme, removeScheme } = useAppSchemeState();
  const { setMyPreferences } = useCurrentAccountState();

  const updateMePreferences = useCallback(
    async (preferences: AccountPreferences) => {
      setMyPreferences(preferences);
      const preferScheme = preferences?.appearance?.scheme;

      const scheme =
        preferScheme && systemSchemes.includes(preferScheme)
          ? preferScheme
          : undefined;

      if (Platform.OS === 'web') {
        if (scheme) {
          setScheme(scheme);
        } else {
          removeScheme();
        }
      } else {
        Appearance.setColorScheme(scheme);
      }
    },
    [removeScheme, setMyPreferences, setScheme],
  );

  return {
    updateMe: setMe,
    updateMePreferences,
    me,
    stats,
    setMyStats,
    setMySubscriptions,
  };
};

export const useCurrentAccountUpdater = () => {
  const { me, updateMe, setMyStats, updateMePreferences } = useCurrentAccount();
  const {
    mutateAsync: updatePreferences,
    isPending: arePreferencesUpdating,
    error: updatePreferencesError,
  } = useUpdateAccountMePreferencesReq();
  const {
    mutateAsync: updateAccount,
    isPending: isAccountUpdating,
    error: updateAccountError,
  } = useAccountMeUpdateReq();
  const {
    mutateAsync: updateAvatar,
    isPending: isAvatarUpdating,
    error: updateAvatarError,
  } = useAccountMeUpdateReq();
  const {
    mutateAsync: removeAvatar,
    isPending: isAvatarRemoving,
    error: removeAvatarError,
  } = useAccountMeRemoveAvatarReq();

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
          void updateMePreferences(merge(initialPreferences, data));
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
    setMyStats,
    updating: arePreferencesUpdating || isAccountUpdating,
    updateError: updatePreferencesError || updateAccountError,
    avatarUpdating: isAvatarUpdating || isAvatarRemoving,
    avatarError: updateAvatarError || removeAvatarError,
  };
};
