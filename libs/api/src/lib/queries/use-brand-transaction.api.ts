import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { BrandTransaction } from '../types/brand-transaction';
import { PaginationListParams } from '../types/pagination';

export enum BrandTransactionQueryKey {
  currentList = 'brand-transaction-current-list',
  clientList = 'brand-transaction-client-list',
}

export const useCurrentBrandTransactionListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandTransaction>({
    storeInitialData: true,
    refetchOnMount: true,
    apUrl: '/api/brand-transaction',
    queryKey: [BrandTransactionQueryKey.currentList, props?.params],
    ...props,
  });

export const useBrandClientTransactionListReq = (
  clientId: string,
  params?: PaginationListParams,
) =>
  useInfiniteQueryWrapper<BrandTransaction>({
    refetchOnMount: true,
    apUrl: `/api/brand-transaction/client/${clientId}`,
    queryKey: [BrandTransactionQueryKey.clientList, params],
  });
