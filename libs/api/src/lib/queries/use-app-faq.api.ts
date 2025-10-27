import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import { FAQ } from '../types/faq';

export enum AppFaqQueryKey {
  list = 'app-faq-list',
}

export const useAppFaqReq = () =>
  useQuery<FAQ[], string>({
    queryKey: [AppFaqQueryKey.list],
    queryFn: () => requestWithStringError(axios.get('/api/app-faq')),
  });
