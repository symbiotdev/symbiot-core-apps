import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Account, UpdateAccountData } from '../types/account';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import { generateFormData } from '../utils/media';
import { AccountPreferences } from '../types/account-preferences';
import { Gender } from '../types/gender';

export enum AccountQueryKey {
  me = 'account-me',
  genders = 'account-genders',
}

export const useAccountMeQuery = ({ enabled }: { enabled: boolean }) =>
  useQuery<Account, string>({
    enabled,
    queryKey: [AccountQueryKey.me],
    queryFn: () => requestWithAlertOnError(axios.get('/api/account/me')),
  });

export const useAccountGendersQuery = () =>
  useQuery<Gender[], string>({
    queryKey: [AccountQueryKey.genders],
    queryFn: () => requestWithStringError(axios.get('/api/account/genders')),
  });

export const useAccountMeUpdate = () =>
  useMutation<Account, string, UpdateAccountData>({
    mutationFn: async (data) =>
      requestWithAlertOnError(
        axios.put(
          '/api/account/me',
          await (data.avatar
            ? generateFormData<UpdateAccountData>(data, ['avatar'])
            : data),
        ),
      ),
  });

export const useAccountMeRemoveAvatar = () =>
  useMutation<Account, string>({
    mutationFn: () =>
      requestWithAlertOnError(axios.delete('/api/account/me/avatar')),
  });

export const useAccountRemoveMe = () =>
  useMutation({
    mutationFn: () => requestWithAlertOnError(axios.delete('/api/account/me')),
  });

export const useUpdateAccountMePreferencesQuery = () =>
  useMutation<AccountPreferences, string, Partial<AccountPreferences>>({
    mutationFn: (data) =>
      requestWithAlertOnError(axios.put('/api/account/me/preferences', data)),
  });
