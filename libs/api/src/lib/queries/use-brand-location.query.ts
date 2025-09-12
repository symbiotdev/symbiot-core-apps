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
import { BrandEmployeesQueryKey } from './use-brand-employee.query';

export enum BrandLocationQueryKey {
  currentList = 'brand-location-current-list',
  byId = 'brand-location-by-id',
  advantages = 'brand-location-advantages',
}

const refetchQueriesByLocationChanges = async (
  location: BrandLocation,
  refetchList = true,
) => {
  queryClient.setQueryData([BrandLocationQueryKey.byId, location.id], location);

  if (refetchList) {
    await queryClient.refetchQueries({
      queryKey: [BrandLocationQueryKey.currentList],
    });
  } else {
    const locations = queryClient.getQueryData<PaginationList<BrandLocation>>([
      BrandLocationQueryKey.currentList,
    ]);

    if (locations) {
      queryClient.setQueryData<PaginationList<BrandLocation>>(
        [BrandLocationQueryKey.currentList],
        {
          ...locations,
          items: locations.items.map((queryLocation) =>
            queryLocation.id === location.id ? location : queryLocation,
          ),
        },
      );
    }
  }
};

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

      await refetchQueriesByLocationChanges(location);

      return location;
    },
  });

export const useRemoveBrandLocationGalleryImagesQuery = () =>
  useMutation<BrandLocation, string, { id: string; imageId: string }>({
    mutationFn: async ({ id, imageId }) => {
      const location = await requestWithAlertOnError<BrandLocation>(
        axios.delete(`/api/brand-location/${id}/gallery/${imageId}`),
      );

      await refetchQueriesByLocationChanges(location);

      return location;
    },
  });

export const useCreateBrandLocationQuery = () =>
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

      await refetchQueriesByLocationChanges(location);

      return location;
    },
  });

export const useUpdateBrandLocationQuery = () =>
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

        await refetchQueriesByLocationChanges(location, false);

        return location;
      },
    },
  );

export const useRemoveBrandLocationQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-location/${id}`),
      );

      queryClient.setQueryData([BrandLocationQueryKey.byId, id], undefined);

      await queryClient.resetQueries({
        queryKey: [BrandEmployeesQueryKey.detailedById],
      });
      await queryClient.refetchQueries({
        queryKey: [BrandLocationQueryKey.currentList],
      });

      return response;
    },
  });

export const useCurrentBrandLocationsQuery = () =>
  useQuery<PaginationList<BrandLocation>, string>({
    queryKey: [BrandLocationQueryKey.currentList],
    queryFn: () =>
      requestWithStringError<PaginationList<BrandLocation>>(
        axios.get('/api/brand-location/current/list'),
      ),
  });

export const useBrandLocationAdvantages = () =>
  useQuery<BrandLocationAdvantage[], string>({
    queryKey: [BrandLocationQueryKey.advantages],
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-location/advantages`)),
  });

export const useBrandLocationByIdQuery = (id: string, enabled = true) => {
  const queryKey = [BrandLocationQueryKey.byId, id];

  return useQuery<BrandLocation, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-location/${id}`)),
  });
};
