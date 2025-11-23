import axios from 'axios';
import {
  BrandLocation,
  BrandLocationAdvantage,
  CreateBrandLocation,
  UpdateBrandLocation,
} from '../types/brand-location';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { queryClient } from '../utils/client';
import { generateFormData } from '../utils/media';
import { ImagePickerAsset } from 'expo-image-picker';
import { refetchQueriesByChanges } from '../utils/query';
import { useQuery } from '../hooks/use-query';
import { useMutation } from '../hooks/use-mutation';

export enum BrandLocationQueryKey {
  currentList = 'brand-location-current-list',
  listByService = 'brand-location-list_by-service',
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
    showAlert: true,
    mutationFn: async ({ id, images }) => {
      const location = (await axios.put(
        `/api/brand-location/${id}/gallery`,
        await generateFormData({ images }, ['images']),
      )) as BrandLocation;

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
    showAlert: true,
    mutationFn: async ({ id, imageName }) => {
      const location = (await axios.delete(
        `/api/brand-location/${id}/gallery/${imageName}`,
      )) as BrandLocation;

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
    showAlert: true,
    mutationFn: async (data) => {
      const location = (await axios.post(
        '/api/brand-location',
        data.avatar
          ? await generateFormData<UpdateBrandLocation>(data, ['avatar'])
          : data,
      )) as BrandLocation;

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
      showAlert: true,
      mutationFn: async ({ id, data }) => {
        const location = (await axios.put(
          `/api/brand-location/${id}`,
          await (data.avatar
            ? generateFormData<UpdateBrandLocation>(data, ['avatar'])
            : data),
        )) as BrandLocation;

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
    showAlert: true,
    mutationFn: async ({ id }) => {
      const response = (await axios.delete(
        `/api/brand-location/${id}`,
      )) as void;

      await refetchQueriesByLocationChanges({
        id,
      });

      return response;
    },
  });

export const useCurrentBrandLocationsReq = ({
  enabled,
}: {
  enabled?: boolean;
} = {}) =>
  useQuery<PaginationList<BrandLocation>, string>({
    enabled,
    queryKey: [BrandLocationQueryKey.currentList],
    url: '/api/brand-location/current',
  });

export const useBrandLocationsByServiceIdReq = (
  serviceId: string,
  params?: PaginationListParams,
) =>
  useQuery<PaginationList<BrandLocation>, string>({
    params,
    queryKey: [BrandLocationQueryKey.listByService, serviceId, params],
    url: `/api/brand-location/service/${serviceId}`,
  });

export const useBrandLocationAdvantagesReq = () =>
  useQuery<BrandLocationAdvantage[], string>({
    queryKey: [BrandLocationQueryKey.advantages],
    url: `/api/brand-location/advantages`,
  });

export const useBrandLocationByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandLocationQueryKey.byId, id];

  return useQuery<BrandLocation, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: `/api/brand-location/${id}`,
  });
};
