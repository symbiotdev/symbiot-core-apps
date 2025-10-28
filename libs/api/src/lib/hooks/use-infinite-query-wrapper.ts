import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';
import axios from 'axios';
import { useCallback, useEffect, useMemo } from 'react';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { queryClient } from '../utils/client';
import { requestWithStringError } from '../utils/request';
import { mmkvGlobalStorage } from '@symbiot-core-apps/storage';
import { getInitialQueryDataStoreQueryKey } from '../utils/initial-query-data';
import type { UseInfiniteQueryResult } from '@tanstack/react-query/src/types';

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
  onRefresh: () => void;
  onEndReached: () => void;
};

export function useInfiniteQueryWrapper<T extends { id: string }>({
  apUrl,
  queryKey,
  params,
  refetchOnMount = false,
  afterKeys = ['id'],
  storeInitialData,
}: {
  apUrl: string;
  queryKey: unknown[];
  refetchOnMount?: boolean;
  afterKeys?: (keyof T)[];
  storeInitialData?: boolean;
  params?: PaginationListParams & Record<string, unknown>;
}) {
  const query = useInfiniteQuery<
    PaginationList<T>,
    string,
    InfiniteData<PaginationList<T>>,
    QueryKey,
    T | undefined
  >({
    getNextPageParam,
    refetchOnMount,
    initialPageParam: undefined,
    queryKey,
    queryFn: ({ pageParam }) =>
      requestWithStringError(
        axios.get(apUrl, {
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

  const onRefresh = useCallback(() => {
    queryClient.setQueryData<InfiniteData<PaginationList<T>>>(
      queryKey,
      (data) =>
        data && {
          pages: [data.pages[0]],
          pageParams: [data.pageParams[0]],
        },
    );

    void query.refetch();
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
    onRefresh,
    onEndReached,
  };
}
