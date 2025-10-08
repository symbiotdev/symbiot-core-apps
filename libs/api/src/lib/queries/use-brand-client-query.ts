import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { PaginationListParams } from '../types/pagination';
import {
  BrandClient,
  BrandClientMembership,
  CreateBrandClient,
  ImportBrandClient,
  UpdateBrandClient,
} from '../types/brand-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import { generateFormData } from '../utils/media';
import { queryClient } from '../utils/client';
import {
  refetchInfiniteListByKey,
  refetchQueriesByChanges,
} from '../utils/query';
import { Gender } from '../types/gender';

export enum BrandClientQueryKey {
  genders = 'brand-client-genders',
  currentList = 'brand-client-current-list',
  detailedById = 'brand-client-detailed-by-id',
  membershipById = 'brand-client-membership-by-id',
}

const refetchQueriesByClientChanges = async (
  entity: {
    id: string;
    data?: BrandClient;
  },
  refetchList = true,
) =>
  refetchQueriesByChanges<BrandClient>({
    refetchList,
    entity,
    queryKeys: {
      byId: [BrandClientQueryKey.detailedById],
      list: [BrandClientQueryKey.currentList],
    },
  });

export const useBrandClientCurrentListQuery = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandClient>({
    ...props,
    apUrl: '/api/brand-client',
    queryKey: [BrandClientQueryKey.currentList, props?.params],
    storeInitialData: true,
  });

export const useBrandClientGendersQuery = () =>
  useQuery<Gender[], string>({
    queryKey: [BrandClientQueryKey.genders],
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-client/genders')),
  });

export const useCreateBrandClientQuery = () =>
  useMutation<BrandClient, string, CreateBrandClient>({
    mutationFn: async (data) => {
      const client = await requestWithAlertOnError<BrandClient>(
        axios.post(
          `/api/brand-client/add`,
          await generateFormData<CreateBrandClient>(data, ['avatar']),
        ),
      );

      await refetchQueriesByClientChanges({
        id: client.id,
        data: client,
      });

      return client;
    },
  });

export const useImportBrandClientsQuery = () =>
  useMutation<BrandClient[], string, ImportBrandClient[]>({
    mutationFn: async (clients) => {
      const importedClients = await requestWithAlertOnError<BrandClient[]>(
        axios.post(`/api/brand-client/import`, {
          clients: clients,
        }),
      );

      importedClients.forEach((client) => {
        queryClient.setQueryData(
          [BrandClientQueryKey.detailedById, client.id],
          client,
        );
      });

      await refetchInfiniteListByKey(BrandClientQueryKey.currentList);

      return importedClients;
    },
  });

export const useBrandClientDetailedByIdQuery = (id: string, enabled = true) => {
  const queryKey = [BrandClientQueryKey.detailedById, id];

  return useQuery<BrandClient, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-client/detailed/${id}`)),
  });
};

export const useBrandClientMembershipByIdQuery = (
  clientId: string,
  membershipId: string,
  enabled = true,
) => {
  const queryKey = [BrandClientQueryKey.membershipById, clientId, membershipId];

  return useQuery<BrandClientMembership, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(
        axios.get(`/api/brand-client/${clientId}/membership/${membershipId}`),
      ),
  });
};

export const useUpdateBrandClientQuery = () =>
  useMutation<BrandClient, string, { id: string; data: UpdateBrandClient }>({
    mutationFn: async ({ id, data }) => {
      const client = await requestWithAlertOnError<BrandClient>(
        axios.put(
          `/api/brand-client/${id}`,
          await (data.avatar
            ? generateFormData<UpdateBrandClient>(data, ['avatar'])
            : data),
        ),
      );

      await refetchQueriesByClientChanges(
        {
          id,
          data: client,
        },
        false,
      );

      return client;
    },
  });

export const useRemoveBrandClientQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-client/${id}`),
      );

      await refetchQueriesByClientChanges({
        id,
      });

      return response;
    },
  });

export const useBrandClientImportTemplateQuery = () =>
  useMutation<ArrayBufferLike, string>({
    mutationFn: () =>
      requestWithAlertOnError<ArrayBufferLike>(
        axios.get(`/api/brand-client/template`, {
          responseType: 'arraybuffer',
        }),
      ),
  });

export const useBrandClientAddMembershipQuery = () =>
  useMutation<
    BrandClientMembership,
    string,
    { clientId: string; membershipId: string }
  >({
    mutationFn: async ({ clientId, membershipId }) => {
      const membership = await requestWithAlertOnError<BrandClientMembership>(
        axios.post(
          `/api/brand-client/${clientId}/membership/${membershipId}/add`,
        ),
      );

      const clientQueryKey = [BrandClientQueryKey.detailedById, clientId];
      const client = queryClient.getQueryData<BrandClient>(clientQueryKey);

      if (client) {
        queryClient.setQueryData(clientQueryKey, {
          ...client,
          memberships: [...(client.memberships || []), membership],
        });
      }

      return membership;
    },
  });
