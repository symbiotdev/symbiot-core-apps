import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Brand, CreateBrand, UpdateBrandData } from '../types/brand';
import { requestWithAlertOnError } from '../utils/request';
import { generateFormData } from '../utils/media';
import { AccountAuthTokens } from '../types/account-auth';
import { queryClient } from '../utils/client';
import {
  BrandLocationQueryKey,
  refetchQueriesByLocationChanges,
} from './use-brand-location.query';
import { BrandLocation } from '../types/brand-location';
import { ImagePickerAsset } from 'expo-image-picker';

export enum BrandQueryKey {
  current = 'brand-current',
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
    queryFn: async () => {
      const response = await requestWithAlertOnError<CurrentBrandResponse>(
        axios.get('/api/brand/current'),
      );
      const locations = response?.brand?.locations;

      if (locations?.length) {
        locations.forEach((location) =>
          queryClient.setQueryData(
            [BrandLocationQueryKey.byId, location.id],
            location,
          ),
        );
      }

      return response;
    },
  });

export const useCurrentBrandUpdate = () =>
  useMutation<Brand, string, UpdateBrandData>({
    mutationFn: async (data) =>
      requestWithAlertOnError(
        axios.put(
          '/api/brand/current',
          await (data.avatar
            ? generateFormData<UpdateBrandData>(data, ['avatar'])
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

export const useUploadBrandLocationGalleryImagesQuery = () =>
  useMutation<
    BrandLocation,
    string,
    { id: string; images: ImagePickerAsset[] }
  >({
    mutationFn: async ({ id, images }) => {
      const location = await requestWithAlertOnError<BrandLocation>(
        axios.put(
          `/api/brand-location/${id}/gallery`,
          await generateFormData({ images }, ['images']),
        ),
      );

      if (location) {
        await refetchQueriesByLocationChanges(location);
      }

      return location;
    },
  });

export const useRemoveBrandLocationGalleryImagesQuery = () =>
  useMutation<BrandLocation, string, { id: string; imageId: string }>({
    mutationFn: async ({ id, imageId }) => {
      const location = await requestWithAlertOnError<BrandLocation>(
        axios.delete(`/api/brand-location/${id}/gallery/${imageId}`),
      );

      if (location) {
        await refetchQueriesByLocationChanges(location);
      }

      return location;
    },
  });
