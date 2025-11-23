import axios from 'axios';
import {
  Brand,
  BrandCountry,
  BrandIndustry,
  CreateBrand,
  UpdateBrand,
} from '../types/brand';
import { generateFormData } from '../utils/media';
import { AccountAuthTokens } from '../types/account-auth';
import { queryClient } from '../utils/client';
import { useQuery } from '../hooks/use-query';
import { useMutation } from '../hooks/use-mutation';

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
    showAlert: true,
    queryKey: [BrandQueryKey.current],
    url: '/api/brand/current',
  });

export const useBrandIndustriesReq = () =>
  useQuery<BrandIndustry[], string>({
    queryKey: [BrandQueryKey.industries],
    url: '/api/brand/industries',
  });

export const useBrandCountriesReq = () =>
  useQuery<BrandCountry[], string>({
    queryKey: [BrandQueryKey.countries],
    url: '/api/brand/countries',
  });

export const useBrandCurrenciesReq = () =>
  useQuery<BrandCountry[], string>({
    queryKey: [BrandQueryKey.currencies],
    url: '/api/brand/currencies',
  });

export const useCurrentBrandUpdateReq = () =>
  useMutation<Brand, string, UpdateBrand>({
    showAlert: true,
    mutationFn: async (data) => {
      const brand = (await axios.put(
        '/api/brand/current',
        await (data.avatar
          ? generateFormData<UpdateBrand>(data, ['avatar'])
          : data),
      )) as Brand;

      queryClient.setQueryData([BrandQueryKey.current], { brand });

      return brand;
    },
  });

export const useBrandAuthReq = () =>
  useMutation<{ brand: Brand; tokens: AccountAuthTokens }, string, string>({
    showAlert: true,
    mutationFn: (id: string) => axios.post(`/api/brand/auth/${id}`),
  });

export const useBrandCreateReq = () =>
  useMutation<Brand, string, CreateBrand>({
    showAlert: true,
    mutationFn: async (data) =>
      axios.post(
        '/api/brand',
        await generateFormData<CreateBrand>(data, ['avatar']),
      ),
  });
