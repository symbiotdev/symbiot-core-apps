import { useQuery } from '@tanstack/react-query';
import { Gender } from '../types/gender';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';

export enum GenderQueryKey {
  list = 'gender-list',
}

export const useGenderQuery = () =>
  useQuery<Gender[], string>({
    queryKey: [GenderQueryKey.list],
    queryFn: () => requestWithStringError(axios.get('/api/gender')),
  });
