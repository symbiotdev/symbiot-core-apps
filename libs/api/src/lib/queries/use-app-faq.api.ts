import { FAQ } from '../types/faq';
import { useQuery } from '../hooks/use-query';

export enum AppFaqQueryKey {
  list = 'app-faq-list',
}

export const useAppFaqReq = () =>
  useQuery<FAQ[], string>({
    queryKey: [AppFaqQueryKey.list],
    url: '/api/app-faq',
  });
