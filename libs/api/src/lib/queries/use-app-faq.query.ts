import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import { FAQ } from '../types/faq';

export const useAppFaqQuery = () =>
  useQuery<FAQ[], string>({
    queryKey: ['app-faq'],
    queryFn: () => requestWithStringError(axios.get('/api/app-faq')),
  });
