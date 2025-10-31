import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { PaginationListParams } from '../types/pagination';
import {
  AnyBrandClientMembership,
  BrandClient,
  BrandClientPeriodBasedMembership,
  BrandClientVisitBasedMembership,
  CreateBrandClient,
  ImportBrandClient,
  UpdateBrandClient,
  UpdateBrandClientMembership,
} from '../types/brand-client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import { generateFormData } from '../utils/media';
import { queryClient } from '../utils/client';
import { refetchQueriesByChanges } from '../utils/query';
import { Gender } from '../types/gender';
import { BrandMembershipType } from '../types/brand-membership';

export enum BrandClientQueryKey {
  genders = 'brand-client-genders',
  currentList = 'brand-client-current-list',
  detailedById = 'brand-client-detailed-by-id',
  membershipById = 'brand-client-membership-by-id',
  periodBasedMembershipsList = 'brand-client-period-based-memberships-list',
  visitsBasedMembershipsList = 'brand-client-visits-based-memberships-list',
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
    entities: [entity],
    queryKeys: {
      byId: [BrandClientQueryKey.detailedById],
      list: [BrandClientQueryKey.currentList],
    },
  });

export const useBrandClientCurrentListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandClient>({
    ...props,
    apUrl: '/api/brand-client',
    queryKey: [BrandClientQueryKey.currentList, props?.params],
    storeInitialData: true,
  });

export const useBrandClientPeriodBasedMembershipsListReq = (
  clientId: string,
  props?: {
    params?: PaginationListParams;
  },
) =>
  useInfiniteQueryWrapper<BrandClientPeriodBasedMembership>({
    ...props,
    refetchOnMount: true,
    apUrl: `/api/brand-client/${clientId}/membership`,
    queryKey: [
      BrandClientQueryKey.periodBasedMembershipsList,
      clientId,
      props?.params,
    ],
    params: {
      ...props?.params,
      type: BrandMembershipType.period,
    },
  });

export const useBrandClientVisitsBasedMembershipsListReq = (
  clientId: string,
  props?: {
    params?: PaginationListParams;
  },
) =>
  useInfiniteQueryWrapper<BrandClientVisitBasedMembership>({
    ...props,
    refetchOnMount: true,
    apUrl: `/api/brand-client/${clientId}/membership`,
    queryKey: [
      BrandClientQueryKey.visitsBasedMembershipsList,
      clientId,
      props?.params,
    ],
    params: {
      ...props?.params,
      type: BrandMembershipType.visits,
    },
  });

export const useBrandClientGendersReq = () =>
  useQuery<Gender[], string>({
    queryKey: [BrandClientQueryKey.genders],
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-client/genders')),
  });

export const useCreateBrandClientReq = () =>
  useMutation<BrandClient, string, CreateBrandClient>({
    mutationFn: async (data) => {
      const client = await requestWithAlertOnError<BrandClient>(
        axios.post(
          `/api/brand-client`,
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

export const useImportBrandClientsReq = () =>
  useMutation<BrandClient[], string, ImportBrandClient[]>({
    mutationFn: async (clients) => {
      const importedClients = await requestWithAlertOnError<BrandClient[]>(
        axios.post(`/api/brand-client/import`, {
          clients,
        }),
      );

      importedClients.forEach((client) => {
        queryClient.setQueryData(
          [BrandClientQueryKey.detailedById, client.id],
          client,
        );
      });

      queryClient.removeQueries({
        queryKey: [BrandClientQueryKey.currentList],
      });

      return importedClients;
    },
  });

export const useBrandClientDetailedByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandClientQueryKey.detailedById, id];

  return useQuery<BrandClient, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-client/detailed/${id}`)),
  });
};

export const useBrandClientMembershipByIdReq = (
  clientId: string,
  membershipId: string,
  enabled = true,
) => {
  const queryKey = [BrandClientQueryKey.membershipById, clientId, membershipId];

  return useQuery<AnyBrandClientMembership, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(
        axios.get(`/api/brand-client/${clientId}/membership/${membershipId}`),
      ),
  });
};

export const useUpdateBrandClientReq = () =>
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

export const useUpdateBrandClientMembershipReq = () =>
  useMutation<
    AnyBrandClientMembership,
    string,
    {
      clientId: string;
      membershipId: string;
      data: UpdateBrandClientMembership;
    }
  >({
    mutationFn: async ({ clientId, membershipId, data }) => {
      const updatedMembership =
        await requestWithAlertOnError<AnyBrandClientMembership>(
          axios.put(
            `/api/brand-client/${clientId}/membership/${membershipId}`,
            data,
          ),
        );

      const clientQueryKey = [BrandClientQueryKey.detailedById, clientId];
      const client = queryClient.getQueryData<BrandClient>(clientQueryKey);

      queryClient.setQueryData(
        [BrandClientQueryKey.membershipById, clientId, membershipId],
        updatedMembership,
      );

      if (client) {
        queryClient.setQueryData(clientQueryKey, {
          ...client,
          memberships: client.memberships?.map((clientMembership) =>
            clientMembership.id === membershipId
              ? updatedMembership
              : clientMembership,
          ),
        });
      }

      return updatedMembership;
    },
  });

export const useRemoveBrandClientReq = () =>
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

export const useRemoveBrandClientMembershipReq = () =>
  useMutation<void, string, { clientId: string; membershipId: string }>({
    mutationFn: async ({ clientId, membershipId }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(
          `/api/brand-client/${clientId}/membership/${membershipId}`,
        ),
      );

      const clientQueryKey = [BrandClientQueryKey.detailedById, clientId];
      const client = queryClient.getQueryData<BrandClient>(clientQueryKey);

      if (client) {
        queryClient.setQueryData(clientQueryKey, {
          ...client,
          memberships: client.memberships.filter(
            ({ id }) => id !== membershipId,
          ),
        });
      }

      return response;
    },
  });

export const useBrandClientImportTemplateReq = () =>
  useMutation<ArrayBufferLike, string>({
    mutationFn: () =>
      requestWithAlertOnError<ArrayBufferLike>(
        axios.get(`/api/brand-client/template`, {
          responseType: 'arraybuffer',
        }),
      ),
  });

export const useBrandClientAddMembershipReq = () =>
  useMutation<
    AnyBrandClientMembership,
    string,
    { clientId: string; membershipId: string }
  >({
    mutationFn: async ({ clientId, membershipId }) => {
      const membership =
        await requestWithAlertOnError<AnyBrandClientMembership>(
          axios.post(
            `/api/brand-client/${clientId}/membership/${membershipId}`,
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
