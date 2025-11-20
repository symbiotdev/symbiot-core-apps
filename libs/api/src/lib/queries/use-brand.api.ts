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
import { queryClient } from '../utils/client';

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

export const useCurrentBrandReq = ({ enabled }: { enabled: boolean }) =>
  useQuery<CurrentBrandResponse, string>({
    enabled,
    queryKey: [BrandQueryKey.current],
    queryFn: () =>
      requestWithAlertOnError<CurrentBrandResponse>(
        axios.get('/api/brand/current'),
      ),
  });

export const useBrandIndustriesReq = () =>
  useQuery<BrandIndustry[], string>({
    queryKey: [BrandQueryKey.industries],
    queryFn: () => requestWithStringError(axios.get('/api/brand/industries')),
  });

export const useBrandCountriesReq = () =>
  useQuery<BrandCountry[], string>({
    queryKey: [BrandQueryKey.countries],
    queryFn: () => requestWithStringError(axios.get('/api/brand/countries')),
  });

export const useBrandCurrenciesReq = () =>
  useQuery<BrandCountry[], string>({
    queryKey: [BrandQueryKey.currencies],
    queryFn: () => requestWithStringError(axios.get('/api/brand/currencies')),
  });

export const useCurrentBrandUpdateReq = () =>
  useMutation<Brand, string, UpdateBrand>({
    mutationFn: async (data) => {
      const brand = await requestWithAlertOnError<Brand>(
        axios.put(
          '/api/brand/current',
          await (data.avatar
            ? generateFormData<UpdateBrand>(data, ['avatar'])
            : data),
        ),
      );

      queryClient.setQueryData([BrandQueryKey.current], { brand });

      return brand;
    },
  });

export const useBrandAuthReq = () =>
  useMutation<{ brand: Brand; tokens: AccountAuthTokens }, string, string>({
    mutationFn: (id: string) =>
      requestWithAlertOnError(axios.post(`/api/brand/auth/${id}`)),
  });

export const useBrandCreateReq = () =>
  useMutation<Brand, string, CreateBrand>({
    mutationFn: async (data) =>
      requestWithAlertOnError(
        axios.post(
          '/api/brand',
          await generateFormData<CreateBrand>(data, ['avatar']),
        ),
      ),
  });
