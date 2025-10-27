import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithAlertOnError } from '../utils/request';
import { LocationReverseParams } from '../types/location';

export enum LocationQueryKey {
}

export const useLocationReverseReq = () =>
  useMutation<{ address: string }, string, LocationReverseParams>({
    mutationFn: (params) =>
      requestWithAlertOnError(
        axios.get('/api/location/reverse', {
          params,
        }),
      ),
  });
