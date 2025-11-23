import axios from 'axios';
import { UpdateAccountDevice } from '../types/account-device';
import { useMutation } from '../hooks/use-mutation';

export const useAccountUpdateDeviceReq = () =>
  useMutation<void, string, Partial<UpdateAccountDevice>>({
    showAlert: true,
    mutationFn: (data) => axios.put('/api/account-device', data),
  });
