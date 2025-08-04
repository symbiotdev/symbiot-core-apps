import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReferralSource } from '../types/referral-source';
import { requestWithStringError } from '../utils/request';

export const useSbBusinessReferralSource = () =>
  useQuery<ReferralSource[], string>({
    queryKey: ['sb-business-referral-source'],
    queryFn: () =>
      requestWithStringError(axios.get('/api/sb-business-referral-source')),
  });
