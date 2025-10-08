import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';
import axios from 'axios';
import { useCallback, useEffect, useMemo } from 'react';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { queryClient } from '../utils/client';
import { requestWithStringError } from '../utils/request';
import { mmkvGlobalStorage } from '@symbiot-core-apps/storage';

function getNextPageParam<T>(page: PaginationList<T>) {
  return page.items.length < page.count
    ? page.items[page.items.length - 1]
    : undefined;
}

const storeKeyPrefix = 'initial-infinite-query-data';

const getStoreQueryKey = (queryKey: unknown[]) => {
  return `${storeKeyPrefix}-${queryKey.map(String).join('/')}`;
};

export const clearInitialInfiniteQueryData = () => {
  mmkvGlobalStorage
    .getAllKeys()
    .filter((key) => key.indexOf(storeKeyPrefix) === 0)
    .forEach((key) => {
      mmkvGlobalStorage.delete(key)
    });
};

export function useInfiniteQueryWrapper<T>({
  apUrl,
  queryKey,
  params,
  refetchOnMount = false,
  storeInitialData,
}: {
  apUrl: string;
  queryKey: unknown[];
  refetchOnMount?: boolean;
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
            ...(!!pageParam && {
              after: {
                id: (pageParam as { id: string })['id'],
              },
            }),
          },
        }),
      ),
  });

  const items = useMemo(() => {
    if (query.data?.pages?.length) {
      return query.data.pages.flatMap((page) => page.items);
    }

    const storedDate = mmkvGlobalStorage.getString(getStoreQueryKey(queryKey));

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
        getStoreQueryKey(queryKey),
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
