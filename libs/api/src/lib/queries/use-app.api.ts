import { BrandSourceOption } from '../types/brand';
import { useQuery } from '../hooks/use-query';
import { AppSettings } from '../types/app-settings';

export enum AppQueryKey {
  settings = 'app-settings',
  competitors = 'app-competitors',
  referrals = 'app-referrals',
}

export const useAppSettingsOverridesReq = () =>
  useQuery<AppSettings, string>({
    staleTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    queryKey: [AppQueryKey.settings],
    url: '/api/app/settings/overrides',
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
