import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import {
  BrandService,
  BrandServiceFormat,
  BrandServiceGender,
  BrandServiceType,
  CreateBrandService,
} from '../types/brand-service';
import { refetchQueriesByChanges } from '../utils/query';
import { generateFormData } from '../utils/media';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';

export enum BrandServiceQueryKey {
  types = 'brand-service-types',
  formats = 'brand-service-formats',
  genders = 'brand-service-genders',
  currentList = 'brand-service-current-list',
  detailedById = 'brand-service-detailed-by-id',
}

const refetchQueriesByServiceChanges = async (
  entity: {
    id: string;
    data?: BrandService;
  },
  refetchList = true,
) =>
  refetchQueriesByChanges<BrandService>({
    refetchList,
    entity,
    queryKeys: {
      byId: [BrandServiceQueryKey.detailedById],
      list: [BrandServiceQueryKey.currentList],
    },
  });

export const useBrandServiceTypesQuery = () =>
  useQuery<BrandServiceType[], string>({
    queryKey: [BrandServiceQueryKey.types],
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-service/types')),
  });

export const useBrandServiceFormatsQuery = () =>
  useQuery<BrandServiceFormat[], string>({
    queryKey: [BrandServiceQueryKey.formats],
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-service/formats')),
  });

export const useBrandServiceGendersQuery = () =>
  useQuery<BrandServiceGender[], string>({
    queryKey: [BrandServiceQueryKey.genders],
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-service/genders')),
  });

export const useCurrentBrandServiceListQuery = (props?: {
  initialState?: PaginationList<BrandService>;
  setInitialState?: (state: PaginationList<BrandService>) => void;
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper({
    apUrl: '/api/brand-service',
    queryKey: [BrandServiceQueryKey.currentList, props?.params],
    ...props,
  });

export const useCreateBrandServiceQuery = () =>
  useMutation<BrandService, string, CreateBrandService>({
    mutationFn: async (data) => {
      const service = await requestWithAlertOnError<BrandService>(
        axios.post(
          `/api/brand-service/add`,
          await generateFormData<CreateBrandService>(data, ['avatar']),
        ),
      );

      await refetchQueriesByServiceChanges({
        id: service.id,
        data: service,
      });

      return service;
    },
  });
