import axios from 'axios';
import { LocationReverseParams } from '../types/location';
import { useMutation } from '../hooks/use-mutation';

export enum LocationQueryKey {}

export const useLocationReverseReq = () =>
  useMutation<{ address: string }, string, LocationReverseParams>({
    showAlert: true,
    mutationFn: (params) =>
      axios.get('/api/location/reverse', {
        params,
      }),
  });
