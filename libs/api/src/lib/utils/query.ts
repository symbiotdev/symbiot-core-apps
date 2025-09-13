import { PaginationList } from '../types/pagination';
import type { InfiniteData } from '@tanstack/query-core';
import { queryClient } from './client';

export async function refetchInfiniteListByKey(key: string) {
  void queryClient.resetQueries({
    queryKey: [key],
  });

  await queryClient.refetchQueries({
    queryKey: [key],
  });
}

export async function refetchQueriesByChanges<T extends { id: string }>({
  queryKeys,
  entity,
  refetchList,
}: {
  queryKeys: {
    byId: string[];
    list: string[];
  };
  entity: {
    id: string;
    data?: T;
  };
  refetchList: boolean;
}) {
  queryKeys.byId.forEach((key) =>
    queryClient.setQueryData([key, entity.id], entity),
  );

  if (refetchList || !entity.data) {
    await Promise.all(queryKeys.list.map(refetchInfiniteListByKey));
  } else {
    queryKeys.list.forEach((key) => {
      const queryData = queryClient.getQueriesData<
        InfiniteData<PaginationList<T>>
      >({
        queryKey: [key],
        exact: false,
      });

      queryData.forEach(([queryKey, data]) => {
        if (!data) return;

        queryClient.setQueryData<InfiniteData<PaginationList<T>>>(queryKey, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === entity.id ? entity.data as T : item,
            ),
          })),
        });
      });
    });
  }
}
