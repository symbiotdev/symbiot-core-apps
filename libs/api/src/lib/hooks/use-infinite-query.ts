import {
  useInfiniteQuery as useTanStackInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { queryClient } from '../utils/client';
import { requestWithStringError } from '../utils/request';
import { mmkvGlobalStorage } from '@symbiot-core-apps/storage';
import { getInitialQueryDataStoreQueryKey } from '../utils/initial-query-data';

function getNextPageParam<T>(page: PaginationList<T>) {
  return page.items.length < page.count
    ? page.items[page.items.length - 1]
    : undefined;
}

export type InfiniteQuery<T> = UseInfiniteQueryResult<
  InfiniteData<PaginationList<T>, unknown>,
  string
> & {
  items: T[] | undefined;
  isManualRefetching: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
};

export function useInfiniteQuery<T extends { id: string }>({
  url,
  queryKey,
  enabled,
  params,
  refetchOnMount = false,
  afterKeys = ['id'],
  storeInitialData,
}: {
  url: string;
  queryKey: unknown[];
  refetchOnMount?: boolean;
  enabled?: boolean;
  afterKeys?: (keyof T)[];
  storeInitialData?: boolean;
  params?: PaginationListParams & Record<string, unknown>;
}) {
  const [isManualRefetching, setIsManualRefetching] = useState(false);

  const query = useTanStackInfiniteQuery<
    PaginationList<T>,
    string,
    InfiniteData<PaginationList<T>>,
    QueryKey,
    T | undefined
  >({
    enabled,
    refetchOnMount,
    initialPageParam: undefined,
    queryKey,
    getNextPageParam,
    queryFn: ({ pageParam }) =>
      requestWithStringError(
        axios.get(url, {
          params: {
            ...params,
            ...(!!pageParam &&
              afterKeys?.length && {
                after: afterKeys.reduce(
                  (obj, key) => ({
                    ...obj,
                    [key]: (pageParam as T)[key],
                  }),
                  {},
                ),
              }),
          },
        }),
      ),
  });

  const items = useMemo(() => {
    if (query.data?.pages?.length) {
      return query.data.pages.flatMap((page) => page.items);
    }

    const storedDate = mmkvGlobalStorage.getString(
      getInitialQueryDataStoreQueryKey(queryKey),
    );

    if (storedDate) {
      try {
        return JSON.parse(storedDate)['items'] as T[];
      } catch {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [query.data?.pages, queryKey]);

  const onRefresh = useCallback(async () => {
    setIsManualRefetching(true);

    queryClient.setQueryData<InfiniteData<PaginationList<T>>>(
      queryKey,
      (data) =>
        data && {
          pages: [data.pages[0]],
          pageParams: [data.pageParams[0]],
        },
    );

    try {
      await query.refetch();
    } finally {
      setIsManualRefetching(false);
    }
  }, [query, queryKey]);

  const onEndReached = useCallback(
    () =>
      query.hasNextPage && !query.isFetchingNextPage && query.fetchNextPage(),
    [query],
  );

  useEffect(() => {
    if (storeInitialData && query.data?.pages?.length) {
      mmkvGlobalStorage.set(
        getInitialQueryDataStoreQueryKey(queryKey),
        JSON.stringify(query.data.pages[0]),
      );
    }
  }, [query.data?.pages, queryKey, storeInitialData]);

  return {
    ...query,
    items,
    isManualRefetching,
    onRefresh,
    onEndReached,
  };
}
