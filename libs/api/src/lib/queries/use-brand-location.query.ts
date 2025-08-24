import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import { BrandLocation, CreateBrandLocation } from '../types/brand-location';
import { PaginationList } from '../types/pagination';
import { queryClient } from '../utils/client';

export enum BrandLocationQueryKey {
  currentList = 'currentList',
  byId = 'byId',
}

export const useCreateBrandLocationQuery = () =>
  useMutation<BrandLocation, string, CreateBrandLocation>({
    mutationFn: async (data) => {
      const response = await requestWithAlertOnError<BrandLocation>(
        axios.post('/api/brand-location', data),
      );

      if (response) {
        queryClient.setQueryData(
          [BrandLocationQueryKey.byId, response.id],
          response,
        );
      }

      return response;
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
