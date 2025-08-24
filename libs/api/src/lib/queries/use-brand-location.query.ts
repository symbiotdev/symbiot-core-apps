import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import { BrandLocation, CreateBrandLocation } from '../types/brand-location';
import { Brand } from '../types/brand';
import { PaginationList } from '../types/pagination';

export enum BrandLocationQueryKey {
  currentList = 'currentList',
  byId = 'byId',
}

export const useCreateBrandLocationQuery = () =>
  useMutation<Brand, string, CreateBrandLocation>({
    mutationFn: async (data) =>
      requestWithAlertOnError(axios.post('/api/brand-location', data)),
  });

export const useCurrentBrandLocationsQuery = () =>
  useQuery<PaginationList<BrandLocation>, string>({
    queryKey: [BrandLocationQueryKey.currentList],
    queryFn: () => requestWithStringError(axios.get('/api/brand-location')),
  });

export const useBrandLocationByIdQuery = (id: string) =>
  useQuery<BrandLocation, string>({
    queryKey: [BrandLocationQueryKey.byId, id],
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-location/${id}`)),
  });
