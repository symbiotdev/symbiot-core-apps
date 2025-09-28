import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Notification } from '../types/notification';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import type { InfiniteData } from '@tanstack/query-core';
import { PaginationList } from '../types/pagination';
import { useCallback } from 'react';
import { queryClient } from '../utils/client';
import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';

export enum NotificationQueryKey {
  countNew = 'notifications-count-new',
  getList = 'notifications-list',
}

export const useNotificationQueryState = () => {
  const getListState = useCallback(
    () =>
      queryClient.getQueryData<InfiniteData<PaginationList<Notification>>>([
        NotificationQueryKey.getList,
      ]),
    [],
  );

  const setListState = useCallback(
    (data: InfiniteData<PaginationList<Notification>> | undefined) =>
      queryClient.setQueryData<InfiniteData<PaginationList<Notification>>>(
        [NotificationQueryKey.getList],
        data,
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

export const useNotificationsListQuery = (
  props: {
    initialState?: PaginationList<Notification>;
    setInitialState?: (state: PaginationList<Notification>) => void;
  } = {},
) =>
  useInfiniteQueryWrapper<Notification>({
    apUrl: '/api/notification',
    queryKey: [NotificationQueryKey.getList],
    ...props,
  });

export const useNotificationsReadQuery = () => {
  const { markAllAsRead, getListState, setListState } =
    useNotificationQueryState();

  return useMutation({
    mutationFn: async () => {
      const currentState = getListState();

      try {
        await requestWithAlertOnError(axios.put('/api/notification/read'));

        markAllAsRead();
      } catch {
        setListState(currentState);
      }
    },
  });
};
