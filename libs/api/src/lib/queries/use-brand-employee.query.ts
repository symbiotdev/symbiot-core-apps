import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import {
  BrandEmployee,
  BrandEmployeePermission,
  CreateBrandEmployee,
  UpdateBrandEmployee,
} from '../types/brand-employee';
import { Account } from '../types/account';
import { generateFormData } from '../utils/media';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { queryClient } from '../utils/client';
import { refetchQueriesByChanges } from '../utils/query';
import { Gender } from '../types/gender';

export enum BrandEmployeesQueryKey {
  genders = 'brand-employee-genders',
  current = 'brand-employee-current',
  permissions = 'brand-employee-permissions',
  currentList = 'brand-employee-current-list',
  providers = 'brand-employee-providers',
  locationProviders = 'brand-employee-location-providers',
  profileById = 'brand-employee-profile-by-id',
  providerById = 'brand-employee-provider-by-id',
  detailedById = 'brand-employee-detailed-by-id',
}

const refetchQueriesByEmployeeChanges = async (
  entity: {
    id: string;
    data?: BrandEmployee;
  },
  refetchList = true,
) =>
  refetchQueriesByChanges<BrandEmployee>({
    refetchList,
    entity,
    queryKeys: {
      byId: [
        BrandEmployeesQueryKey.profileById,
        BrandEmployeesQueryKey.providerById,
        BrandEmployeesQueryKey.detailedById,
      ],
      list: [
        BrandEmployeesQueryKey.currentList,
        BrandEmployeesQueryKey.providers,
        BrandEmployeesQueryKey.locationProviders,
      ],
    },
  });

export const useCurrentBrandEmployeeQuery = ({
  enabled,
}: {
  enabled: boolean;
}) =>
  useQuery<BrandEmployee>({
    enabled,
    queryKey: [BrandEmployeesQueryKey.current],
    queryFn: async () =>
      requestWithAlertOnError<BrandEmployee>(
        axios.get('/api/brand-employee/current'),
      ),
  });

export const useBrandEmployeeGendersQuery = () =>
  useQuery<Gender[], string>({
    queryKey: [BrandEmployeesQueryKey.genders],
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-employee/genders')),
  });

export const useBrandEmployeePermissionsQuery = () =>
  useQuery<BrandEmployeePermission[], string>({
    enabled: !queryClient.getQueryData([BrandEmployeesQueryKey.permissions]),
    queryKey: [BrandEmployeesQueryKey.permissions],
    queryFn: async () =>
      requestWithStringError<BrandEmployeePermission[]>(
        axios.get('/api/brand-employee/permissions'),
      ),
  });

export const useBrandEmployeeNewAccountQuery = () =>
  useMutation<Account, string, { id: string }>({
    mutationFn: ({ id }) =>
      requestWithAlertOnError<Account>(
        axios.get(`/api/brand-employee/new/account/${id}`),
      ),
  });

export const useCreateBrandEmployeeQuery = () =>
  useMutation<BrandEmployee, string, { id: string; data: CreateBrandEmployee }>(
    {
      mutationFn: async ({ id, data }) => {
        const brandEmployee = await requestWithAlertOnError<BrandEmployee>(
          axios.post(
            `/api/brand-employee/add/account/${id}`,
            await generateFormData<CreateBrandEmployee>(data, ['avatar']),
          ),
        );

        await refetchQueriesByEmployeeChanges({
          id: brandEmployee.id,
          data: brandEmployee,
        });

        return brandEmployee;
      },
    },
  );

export const useUpdateBrandEmployeeQuery = () =>
  useMutation<BrandEmployee, string, { id: string; data: UpdateBrandEmployee }>(
    {
      mutationFn: async ({ id, data }) => {
        const employee = await requestWithAlertOnError<BrandEmployee>(
          axios.put(
            `/api/brand-employee/${id}`,
            await (data.avatar
              ? generateFormData<UpdateBrandEmployee>(data, ['avatar'])
              : data),
          ),
        );

        await refetchQueriesByEmployeeChanges(
          {
            id,
            data: employee,
          },
          false,
        );

        return employee;
      },
    },
  );

export const useRemoveBrandEmployeeQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-employee/${id}`),
      );

      await refetchQueriesByEmployeeChanges({
        id,
      });

      return response;
    },
  });

export const useCurrentBrandEmployeeListQuery = (props?: {
  initialState?: PaginationList<BrandEmployee>;
  setInitialState?: (state: PaginationList<BrandEmployee>) => void;
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandEmployee>({
    apUrl: '/api/brand-employee',
    queryKey: [BrandEmployeesQueryKey.currentList, props?.params],
    ...props,
  });

export const useCurrentBrandEmployeeProvidersListQuery = (props?: {
  initialState?: PaginationList<BrandEmployee>;
  setInitialState?: (state: PaginationList<BrandEmployee>) => void;
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandEmployee>({
    refetchOnMount: true,
    apUrl: '/api/brand-employee/providers',
    queryKey: [BrandEmployeesQueryKey.providers, props?.params],
    ...props,
  });

export const useCurrentBrandEmployeeProvidersByLocationListQuery = (props: {
  location: string;
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandEmployee>({
    refetchOnMount: true,
    apUrl: `/api/brand-employee/location/${props.location}/providers`,
    queryKey: [BrandEmployeesQueryKey.locationProviders, props],
    ...props,
  });

export const useBrandEmployeeProfileByIdQuery = (
  id: string,
  enabled = true,
) => {
  const queryKey = [BrandEmployeesQueryKey.profileById, id];

  return useQuery<BrandEmployee, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-employee/profile/${id}`)),
  });
};

export const useBrandEmployeeProviderByIdQuery = (
  id: string,
  enabled = true,
) => {
  const queryKey = [BrandEmployeesQueryKey.providerById, id];

  return useQuery<BrandEmployee, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-employee/provider/${id}`)),
  });
};

export const useBrandEmployeeDetailedByIdQuery = (
  id: string,
  enabled = true,
) => {
  const queryKey = [BrandEmployeesQueryKey.detailedById, id];

  return useQuery<BrandEmployee, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-employee/detailed/${id}`)),
  });
};
