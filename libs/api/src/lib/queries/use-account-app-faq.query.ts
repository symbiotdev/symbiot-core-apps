import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import { FAQ } from '../types/faq';

export const useAccountAppFaqQuery = () =>
  useQuery<FAQ[], string>({
    queryKey: ['account-app-faq'],
    queryFn: () => requestWithStringError(axios.get('/api/account-app-faq')),
  });
