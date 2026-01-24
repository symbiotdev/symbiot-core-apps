import { AppConfigLegacy } from '../types/app-config-legacy';
import { AppTranslations } from '../types/app-translations';
import { BrandSourceOption } from '../types/brand';
import { useQuery } from '../hooks/use-query';

export enum AppQueryKey {
  config = 'app-config',
  translations = 'app-translations',
  competitors = 'app-competitors',
  referrals = 'app-referrals',
}

export const useAppConfigReq = ({ refetch }: { refetch: boolean }) =>
  useQuery<AppConfigLegacy, string>({
    staleTime: Infinity,
    refetchOnWindowFocus: refetch,
    refetchOnMount: refetch,
    refetchOnReconnect: refetch,
    queryKey: [AppQueryKey.config],
    url: '/api/app/config',
  });

export const useAppTranslationsReq = ({ refetch }: { refetch: boolean }) =>
  useQuery<AppTranslations, string>({
    staleTime: Infinity,
    refetchOnWindowFocus: refetch,
    refetchOnMount: refetch,
    refetchOnReconnect: refetch,
    queryKey: [AppQueryKey.translations],
    url: '/api/app/translations',
  });

export const useAppCompetitorsReq = () =>
  useQuery<BrandSourceOption[], string>({
    staleTime: Infinity,
    queryKey: [AppQueryKey.competitors],
    url: '/api/app/competitors',
  });

export const useAppReferralsReq = () =>
  useQuery<BrandSourceOption[], string>({
    staleTime: Infinity,
    queryKey: [AppQueryKey.referrals],
    url: '/api/app/referrals',
  });
