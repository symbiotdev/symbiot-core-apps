import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ExternalSource } from '../types/external-source';
import { requestWithStringError } from '../utils/request';

export const useAccountReferralSource = () =>
  useQuery<ExternalSource[], string>({
    queryKey: ['account-referral-source'],
    queryFn: () =>
      requestWithStringError(axios.get('/api/account-referral-source')),
  });
