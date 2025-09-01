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
} from '../types/brand-employee';
import { Account } from '../types/account';
import { generateFormData } from '../utils/media';
import { PaginationList } from '../types/pagination';
import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { queryClient } from '../utils/client';

export enum BrandEmployeesQueryKey {
  current = 'brand-employee-current',
  permissions = 'brand-employee-permissions',
  currentList = 'brand-employee-current-list',
  detailedById = 'brand-employee-detailed-by-id',
}

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

export const useBrandEmployeePermissionsQuery = () =>
  useQuery<BrandEmployeePermission[]>({
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

        queryClient.setQueryData(
          [BrandEmployeesQueryKey.detailedById, brandEmployee.id],
          brandEmployee,
        );
        await queryClient.refetchQueries({
          queryKey: [BrandEmployeesQueryKey.currentList],
        });

        return brandEmployee;
      },
    },
  );

export const useRemoveBrandEmployeeQuery = () =>
  useMutation<void, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await requestWithAlertOnError<void>(
        axios.delete(`/api/brand-location/${id}`),
      );

      queryClient.setQueryData(
        [BrandEmployeesQueryKey.detailedById, id],
        undefined,
      );
      await queryClient.refetchQueries({
        queryKey: [BrandEmployeesQueryKey.currentList],
      });

      return response;
    },
  });

export const useCurrentBrandEmployeeListQuery = (
  props: {
    initialState?: PaginationList<BrandEmployee>;
    setInitialState?: (state: PaginationList<BrandEmployee>) => void;
  } = {},
) =>
  useInfiniteQueryWrapper({
    apUrl: '/api/brand-employee',
    queryKey: [BrandEmployeesQueryKey.currentList],
    ...props,
  });

export const useBrandEmployeeDetailedByIdQuery = (id: string) =>
  useQuery<BrandEmployee, string>({
    queryKey: [BrandEmployeesQueryKey.detailedById, id],
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-employee/${id}`)),
  });
