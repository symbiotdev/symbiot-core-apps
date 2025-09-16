import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';
import axios from 'axios';
import { useCallback, useEffect, useMemo } from 'react';
import { PaginationList, PaginationListParams } from '../types/pagination';
import { queryClient } from '../utils/client';
import { requestWithStringError } from '../utils/request';

function getNextPageParam<T>(page: PaginationList<T>) {
  return page.items.length < page.count
    ? page.items[page.items.length - 1]
    : undefined;
}

export function useInfiniteQueryWrapper<T>({
  apUrl,
  queryKey,
  params,
  refetchOnMount = false,
  initialState,
  setInitialState,
}: {
  apUrl: string;
  queryKey: unknown[];
  refetchOnMount?: boolean;
  params?: PaginationListParams;
  initialState?: PaginationList<T>;
  setInitialState?: (state: PaginationList<T>) => void;
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

  const items = useMemo(
    () =>
      query.data?.pages?.length
        ? query.data.pages.flatMap((page) => page.items)
        : initialState?.items,
    [initialState?.items, query.data?.pages],
  );

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
    if (setInitialState && query.data?.pages?.length) {
      setInitialState(query.data.pages[0]);
    }
  }, [query.data?.pages, setInitialState]);

  return {
    ...query,
    items,
    onRefresh,
    onEndReached,
  };
}
