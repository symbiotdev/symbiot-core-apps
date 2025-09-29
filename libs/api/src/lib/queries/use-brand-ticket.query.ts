import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import { refetchQueriesByChanges } from '../utils/query';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { queryClient } from '../utils/client';
import {
  BrandTicket,
  CreateBrandTicket,
  UpdateBrandTicket,
} from '@symbiot-core-apps/api';

export enum BrandTicketQueryKey {
  currentList = 'brand-ticket-current-list',
  profileById = 'brand-ticket-profile-by-id',
  viewById = 'brand-ticket-view-by-id',
  detailedById = 'brand-ticket-detailed-by-id',
}

const refetchQueriesByTicketChanges = async (
  entity: {
    id: string;
    data?: BrandTicket;
  },
  refetchList = true,
) =>
  refetchQueriesByChanges<BrandTicket>({
    refetchList,
    entity,
    queryKeys: {
      byId: [
        BrandTicketQueryKey.profileById,
        BrandTicketQueryKey.viewById,
        BrandTicketQueryKey.detailedById,
      ],
      list: [BrandTicketQueryKey.currentList],
    },
  });

export const useBrandTicketProfileByIdQuery = (id: string, enabled = true) => {
  const queryKey = [BrandTicketQueryKey.profileById, id];

  return useQuery<BrandTicket, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-ticket/profile/${id}`)),
  });
};

export const useBrandTicketViewByIdQuery = (id: string, enabled = true) => {
  const queryKey = [BrandTicketQueryKey.viewById, id];

  return useQuery<BrandTicket, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-ticket/view/${id}`)),
  });
};

export const useBrandTicketDetailedByIdQuery = (id: string, enabled = true) => {
  const queryKey = [BrandTicketQueryKey.detailedById, id];

  return useQuery<BrandTicket, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-ticket/detailed/${id}`)),
  });
};

export const useCurrentBrandTicketListQuery = (props?: {
  initialState?: PaginationList<BrandTicket>;
  setInitialState?: (state: PaginationList<BrandTicket>) => void;
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandTicket>({
    apUrl: '/api/brand-ticket',
    queryKey: [BrandTicketQueryKey.currentList, props?.params],
    ...props,
  });

export const useCreateBrandTicketQuery = () =>
  useMutation<BrandTicket, string, CreateBrandTicket>({
    mutationFn: async (data) => {
      const ticket = await requestWithAlertOnError<BrandTicket>(
        axios.post(`/api/brand-ticket/add`, data),
      );

      await refetchQueriesByTicketChanges({
        id: ticket.id,
        data: ticket,
      });

      return ticket;
    },
  });

export const useUpdateBrandTicketQuery = () =>
  useMutation<BrandTicket, string, { id: string; data: UpdateBrandTicket }>({
    mutationFn: async ({ id, data }) => {
      const ticket = await requestWithAlertOnError<BrandTicket>(
        axios.put(`/api/brand-ticket/${id}`, data),
      );

      await refetchQueriesByTicketChanges(
        {
          id,
          data: ticket,
        },
        false,
      );

      return ticket;
    },
  });

export const useRemoveBrandTicketQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-ticket/${id}`),
      );

      await refetchQueriesByTicketChanges({
        id,
      });

      return response;
    },
  });
