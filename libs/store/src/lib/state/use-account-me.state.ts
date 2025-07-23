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

  const handleMe = useCallback(
    (account: Account) => {
      changeAppLanguage(account.language);
      setMe(account);
    },
    [setMe],
  );

  const updateAccount$ = useCallback(
    async (data: UpdateAccountData) => {
      const initialMe = me;

      try {
        if (initialMe) {
          handleMe({
            ...initialMe,
            ...data,
          });
        }

        const response = await updateAccount(data);

        handleMe(response);
      } catch {
        if (initialMe) {
          handleMe(initialMe);
        }
      }
    },
    [handleMe, me, updateAccount],
  );

  const handlePreferences = useCallback(
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

  const updatePreferences$ = useCallback(
    async (data: Partial<AccountPreferences>) => {
      const initialPreferences = me?.preferences;

      try {
        if (initialPreferences) {
          void handlePreferences({
            ...initialPreferences,
            ...data,
          });
        }

        const preferences = await updatePreferences(data);

        await handlePreferences(preferences);
      } catch {
        if (initialPreferences) {
          void handlePreferences(initialPreferences);
        }
      }
    },
    [handlePreferences, me?.preferences, updatePreferences],
  );

  useEffect(() => {
    if (meResponse) {
      setMe(meResponse);
      handleMe(meResponse);

      if (meResponse.preferences) {
        void handlePreferences(meResponse.preferences);
      }
    }
  }, [handleMe, handlePreferences, meResponse, setMe]);

  return {
    refetchMe$,
    updateAccount$,
    updatePreferences$,
    me,
    meError,
    loading: isMeRefetching,
    updating: arePreferencesUpdating || isAccountUpdating,
    updateError: updatePreferencesError || updateAccountError,
  };
};
