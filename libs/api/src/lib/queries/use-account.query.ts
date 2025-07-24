import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Account, UpdateAccountData } from '../types/account';
import { requestWithAlertOnError } from '../utils/request';

export const useAccountMeQuery = () =>
  useQuery<Account, string>({
    queryKey: ['account-me'],
    queryFn: () => axios.get('/api/account/me'),
  });

export const useAccountMeUpdate = () =>
  useMutation<Account, string, UpdateAccountData>({
    mutationFn: (data) =>
      requestWithAlertOnError(axios.put('/api/account/me', data)),
  });
