import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import {
  BrandLocation,
  BrandLocationAdvantage,
  CreateBrandLocation,
  UpdateBrandLocation,
} from '../types/brand-location';
import { PaginationList } from '../types/pagination';
import { queryClient } from '../utils/client';
import { generateFormData } from '../utils/media';
import { ImagePickerAsset } from 'expo-image-picker';
import { refetchQueriesByChanges } from '../utils/query';

export enum BrandLocationQueryKey {
  currentList = 'brand-location-current-list',
  byId = 'brand-location-by-id',
  advantages = 'brand-location-advantages',
}

const refetchQueriesByLocationChanges = async (
  entity: {
    id: string;
    data?: BrandLocation;
  },
  refetchList = true,
) =>
  refetchQueriesByChanges<BrandLocation>({
    refetchList,
    entities: [entity],
    queryKeys: {
      byId: [BrandLocationQueryKey.byId],
      list: [BrandLocationQueryKey.currentList],
    },
  });

export const useUploadBrandLocationGalleryImagesReq = () =>
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

      await refetchQueriesByLocationChanges(
        {
          id,
          data: location,
        },
        false,
      );

      return location;
    },
  });

export const useRemoveBrandLocationGalleryImagesReq = () =>
  useMutation<BrandLocation, string, { id: string; imageName: string }>({
    mutationFn: async ({ id, imageName }) => {
      const location = await requestWithAlertOnError<BrandLocation>(
        axios.delete(`/api/brand-location/${id}/gallery/${imageName}`),
      );

      await refetchQueriesByLocationChanges(
        {
          id,
          data: location,
        },
        false,
      );

      return location;
    },
  });

export const useCreateBrandLocationReq = () =>
  useMutation<BrandLocation, string, CreateBrandLocation>({
    mutationFn: async (data) => {
      const location = await requestWithAlertOnError<BrandLocation>(
        axios.post(
          '/api/brand-location',
          data.avatar
            ? await generateFormData<UpdateBrandLocation>(data, ['avatar'])
            : data,
        ),
      );

      await refetchQueriesByLocationChanges({
        id: location.id,
        data: location,
      });

      return location;
    },
  });

export const useUpdateBrandLocationReq = () =>
  useMutation<BrandLocation, string, { id: string; data: UpdateBrandLocation }>(
    {
      mutationFn: async ({ id, data }) => {
        const location = await requestWithAlertOnError<BrandLocation>(
          axios.put(
            `/api/brand-location/${id}`,
            await (data.avatar
              ? generateFormData<UpdateBrandLocation>(data, ['avatar'])
              : data),
          ),
        );

        await refetchQueriesByLocationChanges(
          {
            id,
            data: location,
          },
          false,
        );

        return location;
      },
    },
  );

export const useRemoveBrandLocationReq = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-location/${id}`),
      );

      await refetchQueriesByLocationChanges({
        id,
      });

      return response;
    },
  });

export const useCurrentBrandLocationsReq = () =>
  useQuery<PaginationList<BrandLocation>, string>({
    refetchOnMount: false,
    queryKey: [BrandLocationQueryKey.currentList],
    queryFn: () =>
      requestWithStringError<PaginationList<BrandLocation>>(
        axios.get('/api/brand-location/current'),
      ),
  });

export const useBrandLocationAdvantagesReq = () =>
  useQuery<BrandLocationAdvantage[], string>({
    queryKey: [BrandLocationQueryKey.advantages],
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-location/advantages`)),
  });

export const useBrandLocationByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandLocationQueryKey.byId, id];

  return useQuery<BrandLocation, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-location/${id}`)),
  });
};
