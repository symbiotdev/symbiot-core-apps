import axios from 'axios';
import { refetchQueriesByChanges } from '../utils/query';
import { PaginationListParams } from '../types/pagination';
import { useInfiniteQuery } from '../hooks/use-infinite-query';
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
import { useQuery } from '../hooks/use-query';
import { useMutation } from '../hooks/use-mutation';

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
    url: '/api/brand-membership/periods',
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
    url: `/api/brand-membership/profile/${id}`,
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
    url: `/api/brand-membership/detailed/${id}`,
  });
};

export const useBrandPeriodBasedMembershipCurrentListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandPeriodBasedMembership>({
    ...props,
    storeInitialData: true,
    url: '/api/brand-membership',
    queryKey: [BrandMembershipQueryKey.periodBasedCurrentList, props?.params],
    params: {
      ...props?.params,
      type: BrandMembershipType.period,
    },
  });

export const useBrandVisitBasedMembershipCurrentListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandVisitBasedMembership>({
    ...props,
    storeInitialData: true,
    url: '/api/brand-membership',
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
    showAlert: true,
    mutationFn: async (data) => {
      const membership = (await axios.post(
        `/api/brand-membership/${BrandMembershipType.period}`,
        data,
      )) as BrandPeriodBasedMembership;

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
    showAlert: true,
    mutationFn: async (data) => {
      const membership = (await axios.post(
        `/api/brand-membership/${BrandMembershipType.visits}`,
        data,
      )) as BrandVisitBasedMembership;

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
    showAlert: true,
    mutationFn: async ({ id, data }) => {
      const membership = (await axios.put(
        `/api/brand-membership/${id}`,
        data,
      )) as AnyBrandMembership;

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
    showAlert: true,
    mutationFn: async ({ id }) => {
      const response = (await axios.delete(
        `/api/brand-membership/${id}`,
      )) as void;

      await refetchQueriesByMembershipChanges({
        id,
      });

      return response;
    },
  });
