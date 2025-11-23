import axios from 'axios';
import { Account, UpdateAccountData } from '../types/account';
import { generateFormData } from '../utils/media';
import { AccountPreferences } from '../types/account-preferences';
import { Gender } from '../types/gender';
import { useQuery } from '../hooks/use-query';
import { useMutation } from '../hooks/use-mutation';

export enum AccountQueryKey {
  me = 'account-me',
  genders = 'account-genders',
}

export const useAccountMeReq = ({ enabled }: { enabled: boolean }) =>
  useQuery<Account, string>({
    enabled,
    showAlert: true,
    queryKey: [AccountQueryKey.me],
    url: '/api/account/me',
  });

export const useAccountGendersReq = () =>
  useQuery<Gender[], string>({
    queryKey: [AccountQueryKey.genders],
    url: '/api/account/genders',
  });

export const useAccountMeUpdateReq = () =>
  useMutation<Account, string, UpdateAccountData>({
    showAlert: true,
    mutationFn: async (data) =>
      axios.put(
        '/api/account/me',
        await (data.avatar
          ? generateFormData<UpdateAccountData>(data, ['avatar'])
          : data),
      ),
  });

export const useAccountMeRemoveAvatarReq = () =>
  useMutation<Account, string>({
    showAlert: true,
    mutationFn: () => axios.delete('/api/account/me/avatar'),
  });

export const useAccountRemoveMeReq = () =>
  useMutation({
    showAlert: true,
    mutationFn: () => axios.delete('/api/account/me'),
  });

export const useUpdateAccountMePreferencesReq = () =>
  useMutation<AccountPreferences, string, Partial<AccountPreferences>>({
    showAlert: true,
    mutationFn: (data) => axios.put('/api/account/me/preferences', data),
  });
