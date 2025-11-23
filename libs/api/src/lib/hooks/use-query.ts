import { useQuery as useTanStackQuery } from '@tanstack/react-query';
import type { DefaultError, QueryKey } from '@tanstack/query-core';
import axios from 'axios';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import { useQueryEnabled } from './use-query-enabled';

export function useQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: {
  queryKey: TQueryKey;
  url: string;
  enabled?: boolean;
  showAlert?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
  params?: Record<string, unknown>;
}) {
  const enabled = useQueryEnabled(options.enabled);

  return useTanStackQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    enabled,
    queryFn: () =>
      (options.showAlert
        ? requestWithAlertOnError<TQueryFnData>
        : requestWithStringError<TQueryFnData>)(
        axios.get(options.url, {
          params: options.params,
        }),
      ),
  });
}
