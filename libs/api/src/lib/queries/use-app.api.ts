import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import { AppConfig } from '../types/app-config';
import { AppTranslations } from '../types/app-translations';
import { BrandSourceOption } from '../types/brand';

export enum AppQueryKey {
  config = 'app-config',
  translations = 'app-translations',
  competitors = 'app-competitors',
  referrals = 'app-referrals',
}

export const useAppConfigQuery = ({ refetch }: { refetch: boolean }) =>
  useQuery<AppConfig, string>({
    staleTime: Infinity,
    refetchOnWindowFocus: refetch,
    refetchOnMount: refetch,
    refetchOnReconnect: refetch,
    queryKey: [AppQueryKey.config],
    queryFn: () => requestWithStringError(axios.get('/api/app/config')),
  });

export const useAppTranslationsQuery = ({ refetch }: { refetch: boolean }) =>
  useQuery<AppTranslations, string>({
    staleTime: Infinity,
    refetchOnWindowFocus: refetch,
    refetchOnMount: refetch,
    refetchOnReconnect: refetch,
    queryKey: [AppQueryKey.translations],
    queryFn: () => requestWithStringError(axios.get('/api/app/translations')),
  });

export const useAppCompetitorsQuery = () =>
  useQuery<BrandSourceOption[], string>({
    staleTime: Infinity,
    queryKey: [AppQueryKey.competitors],
    queryFn: () => requestWithStringError(axios.get('/api/app/competitors')),
  });

export const useAppReferralsQuery = () =>
  useQuery<BrandSourceOption[], string>({
    staleTime: Infinity,
    queryKey: [AppQueryKey.referrals],
    queryFn: () => requestWithStringError(axios.get('/api/app/referrals')),
  });
