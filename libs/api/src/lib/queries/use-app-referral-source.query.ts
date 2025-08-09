import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ExternalSource } from '../types/external-source';
import { requestWithStringError } from '../utils/request';

export const useAppReferralSource = () =>
  useQuery<ExternalSource[], string>({
    queryKey: ['app-referral-source'],
    queryFn: () =>
      requestWithStringError(axios.get('/api/app-referral-source')),
  });
