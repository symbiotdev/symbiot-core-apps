import { useInfiniteQuery } from '../hooks/use-infinite-query';
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
import axios from 'axios';
import { generateFormData } from '../utils/media';
import { queryClient } from '../utils/client';
import { refetchQueriesByChanges } from '../utils/query';
import { Gender } from '../types/gender';
import { BrandMembershipType } from '../types/brand-membership';
import { useQuery } from '../hooks/use-query';
import { useMutation } from '../hooks/use-mutation';

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
  useInfiniteQuery<BrandClient>({
    ...props,
    url: '/api/brand-client',
    queryKey: [BrandClientQueryKey.currentList, props?.params],
    storeInitialData: true,
  });

export const useBrandClientPeriodBasedMembershipsListReq = (
  clientId: string,
  props?: {
    params?: PaginationListParams;
  },
) =>
  useInfiniteQuery<BrandClientPeriodBasedMembership>({
    ...props,
    refetchOnMount: true,
    url: `/api/brand-client/${clientId}/membership`,
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
  useInfiniteQuery<BrandClientVisitBasedMembership>({
    ...props,
    refetchOnMount: true,
    url: `/api/brand-client/${clientId}/membership`,
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
    url: '/api/brand-client/genders',
  });

export const useCreateBrandClientReq = () =>
  useMutation<BrandClient, string, CreateBrandClient>({
    showAlert: true,
    mutationFn: async (data) => {
      const client = (await axios.post(
        `/api/brand-client`,
        await generateFormData<CreateBrandClient>(data, ['avatar']),
      )) as BrandClient;

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
      const importedClients = (await axios.post(`/api/brand-client/import`, {
        clients,
      })) as BrandClient[];

      importedClients.forEach((client) => {
        queryClient.setQueryData(
          [BrandClientQueryKey.detailedById, client.id],
          client,
        );
      });

      await queryClient.resetQueries({
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
    url: `/api/brand-client/detailed/${id}`,
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
    url: `/api/brand-client/${clientId}/membership/${membershipId}`,
  });
};

export const useUpdateBrandClientReq = () =>
  useMutation<BrandClient, string, { id: string; data: UpdateBrandClient }>({
    showAlert: true,
    mutationFn: async ({ id, data }) => {
      const client = (await axios.put(
        `/api/brand-client/${id}`,
        await (data.avatar
          ? generateFormData<UpdateBrandClient>(data, ['avatar'])
          : data),
      )) as BrandClient;

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
    showAlert: true,
    mutationFn: async ({ clientId, membershipId, data }) => {
      const updatedMembership = (await axios.put(
        `/api/brand-client/${clientId}/membership/${membershipId}`,
        data,
      )) as AnyBrandClientMembership;

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
    showAlert: true,
    mutationFn: async ({ id }) => {
      const response = (await axios.delete(`/api/brand-client/${id}`)) as void;

      await refetchQueriesByClientChanges({
        id,
      });

      return response;
    },
  });

export const useRemoveBrandClientMembershipReq = () =>
  useMutation<void, string, { clientId: string; membershipId: string }>({
    showAlert: true,
    mutationFn: async ({ clientId, membershipId }) => {
      const response = (await axios.delete(
        `/api/brand-client/${clientId}/membership/${membershipId}`,
      )) as void;

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
    showAlert: true,
    mutationFn: () =>
      axios.get(`/api/brand-client/template`, {
        responseType: 'arraybuffer',
      }) as Promise<ArrayBufferLike>,
  });

export const useBrandClientAddMembershipReq = () =>
  useMutation<
    AnyBrandClientMembership,
    string,
    { clientId: string; membershipId: string }
  >({
    showAlert: true,
    mutationFn: async ({ clientId, membershipId }) => {
      const membership = (await axios.post(
        `/api/brand-client/${clientId}/membership/${membershipId}`,
      )) as AnyBrandClientMembership;

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
