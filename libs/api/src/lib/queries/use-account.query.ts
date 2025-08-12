import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Account, UpdateAccountData } from '../types/account';
import { requestWithAlertOnError } from '../utils/request';
import { generateFormData } from '../utils/media';

export enum AccountQueryKey {
  me = 'account-me',
}

export const useAccountMeQuery = ({ enabled }: { enabled: boolean }) =>
  useQuery<Account, string>({
    enabled,
    queryKey: [AccountQueryKey.me],
    queryFn: () => requestWithAlertOnError(axios.get('/api/account/me')),
  });

export const useAccountMeUpdate = () =>
  useMutation<Account, string, UpdateAccountData>({
    mutationFn: async (data) =>
      requestWithAlertOnError(
        axios.put(
          '/api/account/me',
          await generateFormData<UpdateAccountData>(data, ['avatar']),
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
