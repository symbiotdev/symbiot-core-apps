import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ExternalSource } from '../types/external-source';
import { requestWithStringError } from '../utils/request';

export enum AppCompetitorSourceKey {
  sources = 'app-competitor-sources',
}

export const useAppCompetitorSource = () =>
  useQuery<ExternalSource[], string>({
    queryKey: [AppCompetitorSourceKey.sources],
    queryFn: () =>
      requestWithStringError(axios.get('/api/app-competitor-source')),
  });
