import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ExternalSource } from '../types/external-source';
import { requestWithStringError } from '../utils/request';

export enum AppReferralSourceKey {
  sources = 'app-referral-source',
}

export const useAppReferralSource = () =>
  useQuery<ExternalSource[], string>({
    queryKey: [AppReferralSourceKey.sources],
    queryFn: () =>
      requestWithStringError(axios.get('/api/app-referral-source')),
  });
