import { useMutation } from '../hooks/use-mutation';
import {
  AccountSubscription,
  CreateAccountSubscription,
  UpdateAccountSubscription,
} from '../types/account-subscription';
import axios from 'axios';

export const currentSubscriptionType =
  process.env['EXPO_PUBLIC_SUBSCRIPTION_TYPE'];

export const useAccountCreateSubscription = () =>
  useMutation<AccountSubscription, string, CreateAccountSubscription>({
    showAlert: true,
    mutationFn: (data) => axios.post('/api/account-subscription', data),
  });

export const useAccountUpdateSubscription = () =>
  useMutation<AccountSubscription, string, UpdateAccountSubscription>({
    showAlert: true,
    mutationFn: (data) =>
      axios.put(`/api/account-subscription/${currentSubscriptionType}`, data),
  });

export const useAccountDeleteSubscription = () =>
  useMutation<void, string, void>({
    showAlert: true,
    mutationFn: () =>
      axios.delete(`/api/account-subscription/${currentSubscriptionType}`),
  });
