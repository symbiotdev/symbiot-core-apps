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
import { PaginationListParams } from '../types/pagination';
import { useInfiniteQuery } from '../hooks/use-infinite-query';
import { Gender } from '../types/gender';
import { queryClient } from '../utils/client';
import { BrandLocation } from '../types/brand-location';
import { useQuery } from '../hooks/use-query';
import { useMutation } from '../hooks/use-mutation';

export enum BrandServiceQueryKey {
  types = 'brand-service-types',
  formats = 'brand-service-formats',
  genders = 'brand-service-genders',
  currentList = 'brand-service-current-list',
  services = 'brand-services',
  locationServices = 'brand-service-location-services',
  serviceLocations = 'brand-service-service-locations',
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
    entities: [entity],
    queryKeys: {
      byId: [
        BrandServiceQueryKey.profileById,
        BrandServiceQueryKey.viewById,
        BrandServiceQueryKey.detailedById,
      ],
      list: [
        BrandServiceQueryKey.currentList,
        BrandServiceQueryKey.services,
        BrandServiceQueryKey.locationServices,
      ],
    },
  });

export const useBrandServiceProfileByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandServiceQueryKey.profileById, id];

  return useQuery<BrandService, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: `/api/brand-service/profile/${id}`,
  });
};

export const useBrandServiceViewByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandServiceQueryKey.viewById, id];

  return useQuery<BrandService, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: `/api/brand-service/view/${id}`,
  });
};

export const useBrandServiceDetailedByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandServiceQueryKey.detailedById, id];

  return useQuery<BrandService, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: `/api/brand-service/detailed/${id}`,
  });
};

export const useBrandServiceTypesReq = (enabled?: boolean) => {
  const queryKey = [BrandServiceQueryKey.types];

  return useQuery<BrandServiceType[], string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: '/api/brand-service/types',
  });
};

export const useBrandServiceFormatsReq = (enabled?: boolean) => {
  const queryKey = [BrandServiceQueryKey.formats];

  return useQuery<BrandServiceFormat[], string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: '/api/brand-service/formats',
  });
};

export const useBrandServiceGendersReq = (enabled?: boolean) => {
  const queryKey = [BrandServiceQueryKey.genders];

  return useQuery<Gender[], string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: '/api/brand-service/genders',
  });
};

export const useBrandServiceCurrentListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandService>({
    ...props,
    storeInitialData: true,
    url: '/api/brand-service',
    queryKey: [BrandServiceQueryKey.currentList, props?.params],
  });

export const useServicesReq = (props?: { params?: PaginationListParams }) =>
  useInfiniteQuery<BrandService>({
    refetchOnMount: true,
    url: `/api/brand-service/services`,
    queryKey: [BrandServiceQueryKey.services, props],
    ...props,
  });

export const useServicesListByLocationReq = (props: {
  location: string;
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandService>({
    refetchOnMount: true,
    url: `/api/brand-service/location/${props.location}`,
    queryKey: [BrandServiceQueryKey.locationServices, props],
    ...props,
  });

export const useServiceLocationsListReq = (props: {
  service: string;
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandLocation>({
    refetchOnMount: true,
    url: `/api/brand-service/${props.service}/locations`,
    queryKey: [BrandServiceQueryKey.serviceLocations, props],
    ...props,
  });

export const useCreateBrandServiceReq = () =>
  useMutation<BrandService, string, CreateBrandService>({
    showAlert: true,
    mutationFn: async (data) => {
      const service = (await axios.post(
        `/api/brand-service`,
        await generateFormData<CreateBrandService>(data, ['avatar']),
      )) as BrandService;

      await refetchQueriesByServiceChanges({
        id: service.id,
        data: service,
      });

      return service;
    },
  });

export const useUpdateBrandServiceReq = () =>
  useMutation<BrandService, string, { id: string; data: UpdateBrandService }>({
    showAlert: true,
    mutationFn: async ({ id, data }) => {
      const service = (await axios.put(
        `/api/brand-service/${id}`,
        await (data.avatar
          ? generateFormData<UpdateBrandService>(data, ['avatar'])
          : data),
      )) as BrandService;

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

export const useRemoveBrandServiceReq = () =>
  useMutation<void, string, { id: string }>({
    showAlert: true,
    mutationFn: async ({ id }) => {
      const response = (await axios.delete(`/api/brand-service/${id}`)) as void;

      await refetchQueriesByServiceChanges({
        id,
      });

      return response;
    },
  });
