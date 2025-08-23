import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import { AppConfig } from '../types/app-config';
import { AppTranslations } from '../types/app-translations';

export enum AppQueryKey {
  config = 'app-config',
  translations = 'app-translations',
}

export const useAppConfigQuery = ({ refetch }: { refetch: boolean }) =>
  useQuery<AppConfig>({
    staleTime: Infinity,
    refetchOnWindowFocus: refetch,
    refetchOnMount: refetch,
    refetchOnReconnect: refetch,
    queryKey: [AppQueryKey.config],
    queryFn: () => requestWithStringError(axios.get('/api/app/config')),
  });

export const useAppTranslationsQuery = ({ refetch }: { refetch: boolean }) =>
  useQuery<AppTranslations>({
    staleTime: Infinity,
    refetchOnWindowFocus: refetch,
    refetchOnMount: refetch,
    refetchOnReconnect: refetch,
    queryKey: [AppQueryKey.translations],
    queryFn: () => requestWithStringError(axios.get('/api/app/translations')),
  });
