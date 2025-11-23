import { useInfiniteQuery } from '../hooks/use-infinite-query';
import { BrandTransaction } from '../types/brand-transaction';
import { PaginationListParams } from '../types/pagination';

export enum BrandTransactionQueryKey {
  currentList = 'brand-transaction-current-list',
  clientList = 'brand-transaction-client-list',
}

export const useCurrentBrandTransactionListReq = (props?: {
  params?: PaginationListParams;
}) =>
  useInfiniteQuery<BrandTransaction>({
    storeInitialData: true,
    refetchOnMount: true,
    url: '/api/brand-transaction',
    queryKey: [BrandTransactionQueryKey.currentList, props?.params],
    ...props,
  });

export const useBrandClientTransactionListReq = (
  clientId: string,
  params?: PaginationListParams,
) =>
  useInfiniteQuery<BrandTransaction>({
    refetchOnMount: true,
    url: `/api/brand-transaction/client/${clientId}`,
    queryKey: [BrandTransactionQueryKey.clientList, params],
  });
