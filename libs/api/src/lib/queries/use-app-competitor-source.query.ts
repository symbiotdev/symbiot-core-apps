import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ExternalSource } from '../types/external-source';
import { requestWithStringError } from '../utils/request';

export const useAppCompetitorSource = () =>
  useQuery<ExternalSource[], string>({
    queryKey: ['app-competitor-source'],
    queryFn: () =>
      requestWithStringError(axios.get('/api/app-competitor-source')),
  });
