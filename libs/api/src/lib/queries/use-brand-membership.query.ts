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
  BrandMembership,
  BrandMembershipValidity,
  CreateBrandMembership,
  UpdateBrandMembership,
} from '../types/brand-membership';

export enum BrandMembershipQueryKey {
  validities = 'brand-membership-validities',
  currentList = 'brand-membership-current-list',
  profileById = 'brand-membership-profile-by-id',
  viewById = 'brand-membership-view-by-id',
  detailedById = 'brand-membership-detailed-by-id',
}

const refetchQueriesByMembershipChanges = async (
  entity: {
    id: string;
    data?: BrandMembership;
  },
  refetchList = true,
) =>
  refetchQueriesByChanges<BrandMembership>({
    refetchList,
    entity,
    queryKeys: {
      byId: [
        BrandMembershipQueryKey.profileById,
        BrandMembershipQueryKey.viewById,
        BrandMembershipQueryKey.detailedById,
      ],
      list: [BrandMembershipQueryKey.currentList],
    },
  });

export const useBrandMembershipValiditiesQuery = (enabled?: boolean) => {
  const queryKey = [BrandMembershipQueryKey.validities];

  return useQuery<BrandMembershipValidity[], string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-membership/validities')),
  });
};

export const useBrandMembershipProfileByIdQuery = (
  id: string,
  enabled = true,
) => {
  const queryKey = [BrandMembershipQueryKey.profileById, id];

  return useQuery<BrandMembership, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-membership/profile/${id}`)),
  });
};

export const useBrandMembershipViewByIdQuery = (id: string, enabled = true) => {
  const queryKey = [BrandMembershipQueryKey.viewById, id];

  return useQuery<BrandMembership, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-membership/view/${id}`)),
  });
};

export const useBrandMembershipDetailedByIdQuery = (
  id: string,
  enabled = true,
) => {
  const queryKey = [BrandMembershipQueryKey.detailedById, id];

  return useQuery<BrandMembership, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-membership/detailed/${id}`)),
  });
};

export const useCurrentBrandMembershipListQuery = (props?: {
  initialState?: PaginationList<BrandMembership>;
  setInitialState?: (state: PaginationList<BrandMembership>) => void;
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandMembership>({
    apUrl: '/api/brand-membership',
    queryKey: [BrandMembershipQueryKey.currentList, props?.params],
    ...props,
  });

export const useCreateBrandMembershipQuery = () =>
  useMutation<BrandMembership, string, CreateBrandMembership>({
    mutationFn: async (data) => {
      const membership = await requestWithAlertOnError<BrandMembership>(
        axios.post(`/api/brand-membership/add`, data),
      );

      await refetchQueriesByMembershipChanges({
        id: membership.id,
        data: membership,
      });

      return membership;
    },
  });

export const useUpdateBrandMembershipQuery = () =>
  useMutation<
    BrandMembership,
    string,
    { id: string; data: UpdateBrandMembership }
  >({
    mutationFn: async ({ id, data }) => {
      const membership = await requestWithAlertOnError<BrandMembership>(
        axios.put(`/api/brand-membership/${id}`, data),
      );

      await refetchQueriesByMembershipChanges(
        {
          id,
          data: membership,
        },
        false,
      );

      return membership;
    },
  });

export const useRemoveBrandMembershipQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-membership/${id}`),
      );

      await refetchQueriesByMembershipChanges({
        id,
      });

      return response;
    },
  });
