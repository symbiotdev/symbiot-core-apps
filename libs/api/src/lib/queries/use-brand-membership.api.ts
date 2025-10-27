import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import { refetchQueriesByChanges } from '../utils/query';
import { PaginationListParams } from '../types/pagination';
import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { queryClient } from '../utils/client';
import {
  AnyBrandMembership,
  BrandMembership,
  BrandMembershipPeriod,
  BrandMembershipType,
  BrandPeriodBasedMembership,
  BrandVisitBasedMembership,
  CreateBrandPeriodBasedMembership,
  CreateBrandVisitBasedMembership,
  UpdateBrandMembership,
} from '../types/brand-membership';
import { getBrandMembershipType } from '../utils/brand-membership';

export enum BrandMembershipQueryKey {
  periods = 'brand-membership-periods',
  profileById = 'brand-membership-profile-by-id',
  detailedById = 'brand-membership-detailed-by-id',
  periodBasedCurrentList = 'brand-membership-period-based-current-list',
  visitBasedCurrentList = 'brand-membership-visit-based-current-list',
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
    entities: [entity],
    queryKeys: {
      byId: [
        BrandMembershipQueryKey.profileById,
        BrandMembershipQueryKey.detailedById,
      ],
      list: !entity.data
        ? [
            BrandMembershipQueryKey.periodBasedCurrentList,
            BrandMembershipQueryKey.visitBasedCurrentList,
          ]
        : getBrandMembershipType(entity.data) === BrandMembershipType.visits
          ? [BrandMembershipQueryKey.visitBasedCurrentList]
          : [BrandMembershipQueryKey.periodBasedCurrentList],
    },
  });

export const useBrandMembershipPeriodsReq = (enabled?: boolean) => {
  const queryKey = [BrandMembershipQueryKey.periods];

  return useQuery<BrandMembershipPeriod[], string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-membership/periods')),
  });
};

export const useBrandMembershipProfileByIdReq = (
  id: string,
  enabled = true,
) => {
  const queryKey = [BrandMembershipQueryKey.profileById, id];

  return useQuery<AnyBrandMembership, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-membership/profile/${id}`)),
  });
};

export const useBrandMembershipDetailedByIdReq = (
  id: string,
  enabled = true,
) => {
  const queryKey = [BrandMembershipQueryKey.detailedById, id];

  return useQuery<AnyBrandMembership, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-membership/detailed/${id}`)),
  });
};

export const useBrandPeriodBasedMembershipCurrentListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandPeriodBasedMembership>({
    ...props,
    storeInitialData: true,
    apUrl: '/api/brand-membership',
    queryKey: [BrandMembershipQueryKey.periodBasedCurrentList, props?.params],
    params: {
      ...props?.params,
      type: BrandMembershipType.period,
    },
  });

export const useBrandVisitBasedMembershipCurrentListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandVisitBasedMembership>({
    ...props,
    storeInitialData: true,
    apUrl: '/api/brand-membership',
    queryKey: [BrandMembershipQueryKey.visitBasedCurrentList, props?.params],
    params: {
      ...props?.params,
      type: BrandMembershipType.visits,
    },
  });

export const useCreateBrandPeriodBasedMembershipReq = () =>
  useMutation<
    BrandPeriodBasedMembership,
    string,
    CreateBrandPeriodBasedMembership
  >({
    mutationFn: async (data) => {
      const membership =
        await requestWithAlertOnError<BrandPeriodBasedMembership>(
          axios.post(
            `/api/brand-membership/${BrandMembershipType.period}`,
            data,
          ),
        );

      await refetchQueriesByMembershipChanges({
        id: membership.id,
        data: membership,
      });

      return membership;
    },
  });

export const useCreateBrandVisitBasedMembershipReq = () =>
  useMutation<
    BrandVisitBasedMembership,
    string,
    CreateBrandVisitBasedMembership
  >({
    mutationFn: async (data) => {
      const membership =
        await requestWithAlertOnError<BrandVisitBasedMembership>(
          axios.post(
            `/api/brand-membership/${BrandMembershipType.visits}`,
            data,
          ),
        );

      await refetchQueriesByMembershipChanges({
        id: membership.id,
        data: membership,
      });

      return membership;
    },
  });

export const useUpdateBrandMembershipReq = () =>
  useMutation<
    AnyBrandMembership,
    string,
    { id: string; data: UpdateBrandMembership }
  >({
    mutationFn: async ({ id, data }) => {
      const membership = await requestWithAlertOnError<AnyBrandMembership>(
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

export const useRemoveBrandMembershipReq = () =>
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
