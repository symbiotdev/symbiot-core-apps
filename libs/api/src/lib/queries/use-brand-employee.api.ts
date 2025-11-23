import axios from 'axios';
import {
  BrandEmployee,
  BrandEmployeePermission,
  CreateBrandEmployee,
  UpdateBrandEmployee,
} from '../types/brand-employee';
import { Account } from '../types/account';
import { generateFormData } from '../utils/media';
import { PaginationListParams } from '../types/pagination';
import { useInfiniteQuery } from '../hooks/use-infinite-query';
import { queryClient } from '../utils/client';
import { refetchQueriesByChanges } from '../utils/query';
import { Gender } from '../types/gender';
import { useQuery } from '../hooks/use-query';
import { useMutation } from '../hooks/use-mutation';

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
    entities: [entity],
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

export const useCurrentBrandEmployeeReq = ({ enabled }: { enabled: boolean }) =>
  useQuery<BrandEmployee>({
    enabled,
    queryKey: [BrandEmployeesQueryKey.current],
    url: '/api/brand-employee/current',
    showAlert: true,
  });

export const useBrandEmployeeGendersReq = () =>
  useQuery<Gender[], string>({
    queryKey: [BrandEmployeesQueryKey.genders],
    url: '/api/brand-employee/genders',
  });

export const useBrandEmployeePermissionsReq = () =>
  useQuery<BrandEmployeePermission[], string>({
    enabled: !queryClient.getQueryData([BrandEmployeesQueryKey.permissions]),
    queryKey: [BrandEmployeesQueryKey.permissions],
    url: '/api/brand-employee/permissions',
  });

export const useBrandEmployeeNewAccountReq = () =>
  useMutation<Account, string, { id: string }>({
    showAlert: true,
    mutationFn: ({ id }) => axios.get(`/api/brand-employee/new/account/${id}`),
  });

export const useCreateBrandEmployeeReq = () =>
  useMutation<BrandEmployee, string, { id: string; data: CreateBrandEmployee }>(
    {
      showAlert: true,
      mutationFn: async ({ id, data }) => {
        const brandEmployee = (await axios.post(
          `/api/brand-employee/add/account/${id}`,
          await generateFormData<CreateBrandEmployee>(data, ['avatar']),
        )) as BrandEmployee;

        await refetchQueriesByEmployeeChanges({
          id: brandEmployee.id,
          data: brandEmployee,
        });

        return brandEmployee;
      },
    },
  );

export const useUpdateBrandEmployeeReq = () =>
  useMutation<BrandEmployee, string, { id: string; data: UpdateBrandEmployee }>(
    {
      showAlert: true,
      mutationFn: async ({ id, data }) => {
        const employee = (await axios.put(
          `/api/brand-employee/${id}`,
          await (data.avatar
            ? generateFormData<UpdateBrandEmployee>(data, ['avatar'])
            : data),
        )) as BrandEmployee;

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

export const useRemoveBrandEmployeeReq = () =>
  useMutation<void, string, { id: string }>({
    showAlert: true,
    mutationFn: async ({ id }) => {
      const response = (await axios.delete(
        `/api/brand-employee/${id}`,
      )) as void;

      await refetchQueriesByEmployeeChanges({
        id,
      });

      return response;
    },
  });

export const useBrandEmployeeCurrentListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandEmployee>({
    ...props,
    url: '/api/brand-employee',
    queryKey: [BrandEmployeesQueryKey.currentList, props?.params],
    storeInitialData: true,
  });

export const useCurrentBrandEmployeeProvidersListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandEmployee>({
    refetchOnMount: true,
    url: '/api/brand-employee/providers',
    queryKey: [BrandEmployeesQueryKey.providers, props?.params],
    ...props,
  });

export const useCurrentBrandEmployeeProvidersByLocationListReq = (props: {
  location: string;
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandEmployee>({
    refetchOnMount: true,
    url: `/api/brand-employee/location/${props.location}/providers`,
    queryKey: [BrandEmployeesQueryKey.locationProviders, props],
    ...props,
  });

export const useBrandEmployeeProfileByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandEmployeesQueryKey.profileById, id];

  return useQuery<BrandEmployee, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: `/api/brand-employee/profile/${id}`,
  });
};

export const useBrandEmployeeProviderByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandEmployeesQueryKey.providerById, id];

  return useQuery<BrandEmployee, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: `/api/brand-employee/provider/${id}`,
  });
};

export const useBrandEmployeeDetailedByIdReq = (id: string, enabled = true) => {
  const queryKey = [BrandEmployeesQueryKey.detailedById, id];

  return useQuery<BrandEmployee, string>({
    queryKey,
    enabled: enabled || !queryClient.getQueryData(queryKey),
    url: `/api/brand-employee/detailed/${id}`,
  });
};
