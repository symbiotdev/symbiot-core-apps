import { useMutation } from '@tanstack/react-query';
import { requestWithAlertOnError } from '../utils/request';
import axios from 'axios';
import { UpdateAccountDevice } from '../types/account-device';

export const useAccountUpdateDeviceQuery = () =>
  useMutation<void, string, Partial<UpdateAccountDevice>>({
    mutationFn: (data) =>
      requestWithAlertOnError(axios.put('/api/account-device', data)),
  });
