import { useQuery } from '@tanstack/react-query';
import { requestWithAlertOnError } from '../utils/request';
import axios from 'axios';
import { BrandEmployee } from '../types/brand-employee';

export enum BrandEmployeesQueryKey {
  current = 'brand-employee-current',
  currentList = 'brand-employee-current-list',
  byId = 'brand-employee-by-id',
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
