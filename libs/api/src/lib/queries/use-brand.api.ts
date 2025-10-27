import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Brand,
  BrandCountry,
  BrandIndustry,
  CreateBrand,
  UpdateBrand,
} from '../types/brand';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import { generateFormData } from '../utils/media';
import { AccountAuthTokens } from '../types/account-auth';

export enum BrandQueryKey {
  current = 'brand-current',
  industries = 'brand-industries',
  countries = 'brand-countries',
  currencies = 'brand-currencies',
}

type CurrentBrandResponse = {
  brand?: Brand;
  brands?: Brand[];
  tokens?: AccountAuthTokens;
};

export const useCurrentBrandQuery = ({ enabled }: { enabled: boolean }) =>
  useQuery<CurrentBrandResponse>({
    enabled,
    queryKey: [BrandQueryKey.current],
    queryFn: () =>
      requestWithAlertOnError<CurrentBrandResponse>(
        axios.get('/api/brand/current'),
      ),
  });

export const useBrandIndustriesQuery = () =>
  useQuery<BrandIndustry[], string>({
    queryKey: [BrandQueryKey.industries],
    queryFn: () => requestWithStringError(axios.get('/api/brand/industries')),
  });

export const useBrandCountriesQuery = () =>
  useQuery<BrandCountry[], string>({
    queryKey: [BrandQueryKey.countries],
    queryFn: () => requestWithStringError(axios.get('/api/brand/countries')),
  });

export const useBrandCurrenciesQuery = () =>
  useQuery<BrandCountry[], string>({
    queryKey: [BrandQueryKey.currencies],
    queryFn: () => requestWithStringError(axios.get('/api/brand/currencies')),
  });

export const useCurrentBrandUpdate = () =>
  useMutation<Brand, string, UpdateBrand>({
    mutationFn: async (data) =>
      requestWithAlertOnError(
        axios.put(
          '/api/brand/current',
          await (data.avatar
            ? generateFormData<UpdateBrand>(data, ['avatar'])
            : data),
        ),
      ),
  });

export const useBrandAuthQuery = () =>
  useMutation<{ brand: Brand; tokens: AccountAuthTokens }, string, string>({
    mutationFn: (id: string) =>
      requestWithAlertOnError(axios.post(`/api/brand/auth/${id}`)),
  });

export const useBrandCreateQuery = () =>
  useMutation<Brand, string, CreateBrand>({
    mutationFn: async (data) =>
      requestWithAlertOnError(
        axios.post(
          '/api/brand',
          await generateFormData<CreateBrand>(data, ['avatar']),
        ),
      ),
  });
