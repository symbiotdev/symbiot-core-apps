import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ExternalSource } from '../types/external-source';
import { requestWithStringError } from '../utils/request';

export const useAccountCompetitorSource = () =>
  useQuery<ExternalSource[], string>({
    queryKey: ['account-competitor-source'],
    queryFn: () =>
      requestWithStringError(axios.get('/api/account-competitor-source')),
  });
