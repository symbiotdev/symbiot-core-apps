import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import {
  BrandService,
  BrandServiceFormat,
  BrandServiceType,
  CreateBrandService,
  UpdateBrandService,
} from '../types/brand-service';
import { refetchQueriesByChanges } from '../utils/query';
import { generateFormData } from '../utils/media';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { Gender } from '../types/gender';
import { queryClient } from '../utils/client';

export enum BrandServiceQueryKey {
  types = 'brand-service-types',
  formats = 'brand-service-formats',
  genders = 'brand-service-genders',
  currentList = 'brand-service-current-list',
  profileById = 'brand-service-profile-by-id',
  viewById = 'brand-service-view-by-id',
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
      byId: [
        BrandServiceQueryKey.profileById,
        BrandServiceQueryKey.viewById,
        BrandServiceQueryKey.detailedById,
      ],
      list: [BrandServiceQueryKey.currentList],
    },
  });

export const useBrandServiceProfileByIdQuery = (id: string, enabled = true) => {
  const queryKey = [BrandServiceQueryKey.profileById, id];

  return useQuery<BrandService, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-service/profile/${id}`)),
  });
};

export const useBrandServiceViewByIdQuery = (id: string, enabled = true) => {
  const queryKey = [BrandServiceQueryKey.viewById, id];

  return useQuery<BrandService, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-service/view/${id}`)),
  });
};

export const useBrandServiceDetailedByIdQuery = (
  id: string,
  enabled = true,
) => {
  const queryKey = [BrandServiceQueryKey.detailedById, id];

  return useQuery<BrandService, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-service/detailed/${id}`)),
  });
};

export const useBrandServiceTypesQuery = (enabled?: boolean) => {
  const queryKey = [BrandServiceQueryKey.types];

  return useQuery<BrandServiceType[], string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-service/types')),
  });
}

export const useBrandServiceFormatsQuery = (enabled?: boolean) => {
  const queryKey = [BrandServiceQueryKey.formats];

  return useQuery<BrandServiceFormat[], string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-service/formats')),
  });
};

export const useBrandServiceGendersQuery = (enabled?: boolean) => {
  const queryKey = [BrandServiceQueryKey.genders];

  return useQuery<Gender[], string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-service/genders')),
  });
}

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

export const useUpdateBrandServiceQuery = () =>
  useMutation<BrandService, string, { id: string; data: UpdateBrandService }>({
    mutationFn: async ({ id, data }) => {
      const service = await requestWithAlertOnError<BrandService>(
        axios.put(
          `/api/brand-service/${id}`,
          await (data.avatar
            ? generateFormData<UpdateBrandService>(data, ['avatar'])
            : data),
        ),
      );

      await refetchQueriesByServiceChanges(
        {
          id,
          data: service,
        },
        false,
      );

      return service;
    },
  });

export const useRemoveBrandServiceQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-service/${id}`),
      );

      await refetchQueriesByServiceChanges({
        id,
      });

      return response;
    },
  });
