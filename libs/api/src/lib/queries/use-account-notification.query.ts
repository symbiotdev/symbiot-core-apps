import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AccountNotification } from '../types/account-notification';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import type { InfiniteData, QueryKey } from '@tanstack/query-core';
import { PaginationList } from '../types/pagination';
import { getNextPageParam } from '../utils/query';
import { useCallback, useEffect, useMemo } from 'react';
import { queryClient } from '../utils/client';

enum NotificationQueryKey {
  countNew = 'account-notification-count-new',
  getList = 'account-notification',
}

export const useAccountNotificationQueryState = () => {
  const getListState = useCallback(
    () =>
      queryClient.getQueryData<
        InfiniteData<PaginationList<AccountNotification>>
      >([NotificationQueryKey.getList]),
    [],
  );

  const setListState = useCallback(
    (data: InfiniteData<PaginationList<AccountNotification>> | undefined) =>
      queryClient.setQueryData<
        InfiniteData<PaginationList<AccountNotification>>
      >([NotificationQueryKey.getList], data),
    [],
  );

  const clearListCache = useCallback(
    () =>
      queryClient.setQueryData<
        InfiniteData<PaginationList<AccountNotification>>
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

  const addToList = useCallback((notification: AccountNotification) => {
    queryClient.setQueryData<InfiniteData<PaginationList<AccountNotification>>>(
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
    queryClient.setQueryData<InfiniteData<PaginationList<AccountNotification>>>(
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

export const useAccountCountNewNotifications = () =>
  useQuery<{ count: number }, void>({
    queryKey: [NotificationQueryKey.countNew],
    queryFn: () =>
      requestWithStringError(axios.get('/api/account-notification/new/count')),
  });

export const useAccountNotificationLoader = ({
  initialState,
  setInitialState,
}: {
  initialState?: PaginationList<AccountNotification>;
  setInitialState?: (state: PaginationList<AccountNotification>) => void;
} = {}) => {
  const { clearListCache } = useAccountNotificationQueryState();

  const query = useInfiniteQuery<
    PaginationList<AccountNotification>,
    string,
    InfiniteData<PaginationList<AccountNotification>>,
    QueryKey,
    AccountNotification | undefined
  >({
    getNextPageParam,
    refetchOnMount: false,
    initialPageParam: undefined,
    queryKey: [NotificationQueryKey.getList],
    queryFn: ({ pageParam }) =>
      requestWithStringError(
        axios.get('/api/account-notification', {
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

export const useAccountNotificationsReadQuery = () => {
  const { markAllAsRead, getListState, setListState } =
    useAccountNotificationQueryState();

  return useMutation({
    mutationFn: async () => {
      const currentState = getListState();

      try {
        await requestWithAlertOnError(
          axios.put('/api/account-notification/read'),
        );

        markAllAsRead();
      } catch {
        setListState(currentState);
      }
    },
  });
};
