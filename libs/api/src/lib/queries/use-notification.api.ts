import axios from 'axios';
import { Notification } from '../types/notification';
import type { InfiniteData } from '@tanstack/query-core';
import { PaginationList } from '../types/pagination';
import { useCallback } from 'react';
import { queryClient } from '../utils/client';
import { useInfiniteQuery } from '../hooks/use-infinite-query';
import { useQuery } from '../hooks/use-query';
import { useMutation } from '../hooks/use-mutation';

export enum NotificationQueryKey {
  countNew = 'notifications-count-new',
  getList = 'notifications-list',
}

export const useNotificationReqState = () => {
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

export const useCountNewNotificationsReq = () =>
  useQuery<{ count: number }, void>({
    queryKey: [NotificationQueryKey.countNew],
    url: '/api/notification/new/count',
  });

export const useNotificationsListReq = () =>
  useInfiniteQuery<Notification>({
    storeInitialData: true,
    url: '/api/notification',
    queryKey: [NotificationQueryKey.getList],
  });

export const useNotificationsReadReq = () => {
  const { markAllAsRead, getListState, setListState } =
    useNotificationReqState();

  return useMutation({
    showAlert: true,
    mutationFn: async () => {
      const currentState = getListState();

      try {
        await axios.put('/api/notification/read');

        markAllAsRead();
      } catch {
        setListState(currentState);
      }
    },
  });
};
