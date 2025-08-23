import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import { AppConfig } from '../types/app-config';
import { AppTranslations } from '../types/app-translations';

export enum AppQueryKey {
  config = 'app-config',
  translations = 'app-translations',
}

export const useAppConfigQuery = () =>
  useQuery<AppConfig>({
    enabled: false,
    queryKey: [AppQueryKey.config],
    queryFn: () => requestWithStringError(axios.get('/api/app/config')),
  });

export const useAppTranslationsQuery = () =>
  useQuery<AppTranslations>({
    enabled: false,
    queryKey: [AppQueryKey.translations],
    queryFn: () => requestWithStringError(axios.get('/api/app/translations')),
  });
