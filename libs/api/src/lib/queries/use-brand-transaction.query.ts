import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { BrandTransaction } from '../types/brand-transaction';
import { PaginationList, PaginationListParams } from '../types/pagination';

export enum BrandTransactionQueryKey {
  currentList = 'brand-transaction-current-list',
  clientList = 'brand-transaction-client-list',
}

export const useCurrentBrandTransactionListQuery = (props?: {
  initialState?: PaginationList<BrandTransaction>;
  setInitialState?: (state: PaginationList<BrandTransaction>) => void;
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<BrandTransaction>({
    apUrl: '/api/brand-transaction',
    queryKey: [BrandTransactionQueryKey.currentList, props?.params],
    ...props,
  });

export const useBrandClientTransactionListQuery = (
  clientId: string,
  params?: PaginationListParams,
) =>
  useInfiniteQueryWrapper<BrandTransaction>({
    apUrl: `/api/brand-transaction/client/${clientId}`,
    queryKey: [BrandTransactionQueryKey.clientList, params],
  });
