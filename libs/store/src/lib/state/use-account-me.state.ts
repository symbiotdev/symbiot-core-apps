import {
  Account,
  AccountPreferences,
  UpdateAccountData,
  useAccountMeQuery,
  useAccountMeUpdate,
  useUpdateAccountPreferencesQuery,
} from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect } from 'react';
import { Scheme, schemes } from '@symbiot-core-apps/shared';
import { useScheme } from './use-app-theme.state';
import { changeAppLanguage } from '@symbiot-core-apps/i18n';

export type AccountMeState = {
  me?: Account;
  setMe: (me: Account) => void;
  setMePreferences: (preferences: AccountPreferences) => void;
};

export const useAccountMeState = create<AccountMeState>()(
  devtools(
    persist<AccountMeState>(
      (set, get) => ({
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

export const useMe = ({ autoFetch }: { autoFetch?: boolean } = {}) => {
  const { me, setMe } = useAccountMeState();
  const { setScheme } = useScheme();
  const {
    data: meResponse,
    refetch: refetchMe$,
    isPending: isMeRefetching,
    error: meError,
  } = useAccountMeQuery({ autoFetch });
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

  useEffect(() => {
    if (meResponse) {
      setMe(meResponse);
      updateMe(meResponse);

      if (meResponse.preferences) {
        void updateMePreferences(meResponse.preferences);
      }
    }
  }, [updateMe, updateMePreferences, meResponse, setMe]);

  return {
    refetchMe$,
    updateMe,
    updateMePreferences,
    me,
    meError,
    loading: isMeRefetching,
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

  const updateAccount$ = useCallback(
    async (data: UpdateAccountData) => {
      const initialMe = me;

      try {
        if (initialMe) {
          updateMe({
            ...initialMe,
            ...data,
          });
        }

        const response = await updateAccount(data);

        updateMe(response);
      } catch {
        if (initialMe) {
          updateMe(initialMe);
        }
      }
    },
    [updateMe, me, updateAccount],
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
    me,
    updateAccount$,
    updatePreferences$,
    updating: arePreferencesUpdating || isAccountUpdating,
    updateError: updatePreferencesError || updateAccountError,
  };
};
