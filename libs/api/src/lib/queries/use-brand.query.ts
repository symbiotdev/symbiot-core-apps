import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Brand, CreateBrand } from '../types/brand';
import { requestWithAlertOnError } from '../utils/request';
import { generateFormData } from '../utils/media';
import { AccountAuthTokens } from '../types/account-auth';

export enum BrandQueryKey {
  current = 'brand-current',
}

export const useCurrentBrandQuery = ({ enabled }: { enabled: boolean }) =>
  useQuery<
    {
      brand?: Brand;
      brands?: Brand[];
      tokens?: AccountAuthTokens;
    },
    string
  >({
    enabled,
    queryKey: [BrandQueryKey.current],
    queryFn: () => requestWithAlertOnError(axios.get('/api/brand/current')),
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
