import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AccountPreferences } from '../types/account-preferences';
import { requestWithAlertOnError } from '../utils/request';

export const useUpdateAccountPreferencesQuery = () =>
  useMutation<AccountPreferences, string, Partial<AccountPreferences>>({
    mutationFn: (data) =>
      requestWithAlertOnError(axios.put('/api/account-preferences', data)),
  });
