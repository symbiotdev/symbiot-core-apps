import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Notification } from '../types/notification';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';
import { PaginationList } from '../types/pagination';
import { getNextPageParam } from '../utils/query';
import { useCallback, useEffect, useMemo } from 'react';
import { queryClient } from '../utils/client';

export enum NotificationQueryKey {
  countNew = 'notifications-count-new',
  getList = 'notifications-list',
}

export const useNotificationQueryState = () => {
  const getListState = useCallback(
    () =>
      queryClient.getQueryData<
        InfiniteData<PaginationList<Notification>>
      >([NotificationQueryKey.getList]),
    [],
  );

  const setListState = useCallback(
    (data: InfiniteData<PaginationList<Notification>> | undefined) =>
      queryClient.setQueryData<
        InfiniteData<PaginationList<Notification>>
      >([NotificationQueryKey.getList], data),
    [],
  );

  const clearListCache = useCallback(
    () =>
      queryClient.setQueryData<
        InfiniteData<PaginationList<Notification>>
      >(
        [NotificationQueryKey.getList],
        (data) =>
          data && {
            pages: [data.pages[0]],
            pageParams: [data.pageParams[0]],
          },
      ),
    [],
  );

  const addToList = useCallback((notification: Notification) => {
    queryClient.setQueryData<InfiniteData<PaginationList<Notification>>>(
      [NotificationQueryKey.getList],
      (data) =>
        data && {
          pages: data.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  items: [notification, ...page.items],
                }
              : page,
          ),
          pageParams: data.pageParams,
        },
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    queryClient.setQueryData<InfiniteData<PaginationList<Notification>>>(
      [NotificationQueryKey.getList],
      (data) =>
        data && {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((notification) => ({
              ...notification,
              read: true,
            })),
          })),
        },
    );
  }, []);

  return {
    getListState,
    setListState,
    clearListCache,
    addToList,
    markAllAsRead,
  };
};

export const useCountNewNotifications = () =>
  useQuery<{ count: number }, void>({
    queryKey: [NotificationQueryKey.countNew],
    queryFn: () =>
      requestWithStringError(axios.get('/api/notification/new/count')),
  });

export const useNotificationLoader = ({
  initialState,
  setInitialState,
}: {
  initialState?: PaginationList<Notification>;
  setInitialState?: (state: PaginationList<Notification>) => void;
} = {}) => {
  const { clearListCache } = useNotificationQueryState();

  const query = useInfiniteQuery<
    PaginationList<Notification>,
    string,
    InfiniteData<PaginationList<Notification>>,
    QueryKey,
    Notification | undefined
  >({
    getNextPageParam,
    refetchOnMount: false,
    initialPageParam: undefined,
    queryKey: [NotificationQueryKey.getList],
    queryFn: ({ pageParam }) =>
      requestWithStringError(
        axios.get('/api/notification', {
          params: pageParam && {
            after: {
              id: pageParam.id,
            },
          },
        }),
      ),
  });

  const notifications = useMemo(
    () =>
      query.data?.pages?.length
        ? query.data.pages.flatMap((page) => page.items)
        : initialState?.items,
    [initialState?.items, query.data?.pages],
  );

  const onRefresh = useCallback(() => {
    clearListCache();
    void query.refetch();
  }, [clearListCache, query]);

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
    notifications,
    onRefresh,
    onEndReached,
  };
};

export const useNotificationsReadQuery = () => {
  const { markAllAsRead, getListState, setListState } =
    useNotificationQueryState();

  return useMutation({
    mutationFn: async () => {
      const currentState = getListState();

      try {
        await requestWithAlertOnError(
          axios.put('/api/notification/read'),
        );

        markAllAsRead();
      } catch {
        setListState(currentState);
      }
    },
  });
};
