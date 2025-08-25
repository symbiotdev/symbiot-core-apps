import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import {
  BrandLocation,
  CreateBrandLocation,
  UpdateBrandLocation,
} from '../types/brand-location';
import { PaginationList } from '../types/pagination';
import { queryClient } from '../utils/client';
import { generateFormData } from '../utils/media';

export enum BrandLocationQueryKey {
  currentList = 'currentList',
  byId = 'byId',
}

export const refetchQueriesByLocationChanges = async (
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

export const useCreateBrandLocationQuery = () =>
  useMutation<BrandLocation, string, CreateBrandLocation>({
    mutationFn: async (data) => {
      const location = await requestWithAlertOnError<BrandLocation>(
        axios.post(
          '/api/brand-location',
          data.avatar
            ? generateFormData<UpdateBrandLocation>(data, ['avatar'])
            : data,
        ),
      );

      if (location) {
        await refetchQueriesByLocationChanges(location);
      }

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

        if (location) {
          await refetchQueriesByLocationChanges(location, false);
        }

        return location;
      },
    },
  );

export const useRemoveBrandLocationQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const location = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-location/${id}`),
      );

      queryClient.setQueryData([BrandLocationQueryKey.byId, id], undefined);

      await queryClient.refetchQueries({
        queryKey: [BrandLocationQueryKey.currentList],
      });

      return location;
    },
  });

export const useCurrentBrandLocationsQuery = () =>
  useQuery<PaginationList<BrandLocation>, string>({
    queryKey: [BrandLocationQueryKey.currentList],
    queryFn: async () => {
      const response = await requestWithStringError<
        PaginationList<BrandLocation>
      >(axios.get('/api/brand-location'));

      response?.items?.forEach((location) =>
        queryClient.setQueryData(
          [BrandLocationQueryKey.byId, location.id],
          location,
        ),
      );

      return response;
    },
  });

export const useBrandLocationByIdQuery = (id: string) =>
  useQuery<BrandLocation, string>({
    queryKey: [BrandLocationQueryKey.byId, id],
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-location/${id}`)),
  });
