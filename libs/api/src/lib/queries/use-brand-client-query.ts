import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { PaginationList } from '../types/pagination';
import {
  BrandClient,
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
import { refetchQueriesByChanges } from '../utils/query';

export enum BrandClientQueryKey {
  currentList = 'brand-client-current-list',
  detailedById = 'brand-client-detailed-by-id',
}

const refetchQueriesByClientChanges = async (
  client: BrandClient,
  refetchList = true,
) =>
  refetchQueriesByChanges<BrandClient>({
    refetchList,
    entity: client,
    queryKeys: {
      byId: BrandClientQueryKey.detailedById,
      list: BrandClientQueryKey.currentList,
    },
  });

export const useCurrentBrandClientListQuery = (
  props: {
    initialState?: PaginationList<BrandClient>;
    setInitialState?: (state: PaginationList<BrandClient>) => void;
  } = {},
) =>
  useInfiniteQueryWrapper({
    apUrl: '/api/brand-client',
    queryKey: [BrandClientQueryKey.currentList],
    ...props,
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

      queryClient.setQueryData(
        [BrandClientQueryKey.detailedById, client.id],
        client,
      );
      await queryClient.refetchQueries({
        queryKey: [BrandClientQueryKey.currentList],
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

      await queryClient.refetchQueries({
        queryKey: [BrandClientQueryKey.currentList],
      });

      return importedClients;
    },
  });

export const useBrandClientDetailedByIdQuery = (id: string) =>
  useQuery<BrandClient, string>({
    queryKey: [BrandClientQueryKey.detailedById, id],
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-client/detailed/${id}`)),
  });

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

      await refetchQueriesByClientChanges(client, false);

      return client;
    },
  });

export const useRemoveBrandClientQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-client/${id}`),
      );

      queryClient.setQueryData(
        [BrandClientQueryKey.detailedById, id],
        undefined,
      );
      await queryClient.refetchQueries({
        queryKey: [BrandClientQueryKey.currentList],
      });

      return response;
    },
  });

export const useUpdateBrandClientImportTemplateQuery = () =>
  useMutation<ArrayBufferLike, string>({
    mutationFn: () =>
      requestWithAlertOnError<ArrayBufferLike>(
        axios.get(`/api/brand-client/template`, {
          responseType: 'arraybuffer',
        }),
      ),
  });
