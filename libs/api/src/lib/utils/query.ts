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
  entities,
  refetchList,
}: {
  queryKeys: {
    byId: string[];
    list: string[];
  };
  entities: {
    id: string;
    data?: T;
  }[];
  refetchList: boolean;
}) {
  entities.forEach((entity) => {
    queryKeys.byId.forEach((key) =>
      queryClient.setQueryData([key, entity.id], entity.data),
    );
  });

  if (refetchList || entities.some(({ data }) => !data)) {
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
        if (!data?.pages) return;

        queryClient.setQueryData<InfiniteData<PaginationList<T>>>(queryKey, {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => {
              const targetEntity = entities.find(
                (entity) => entity.id === item.id,
              );

              return targetEntity ? (targetEntity.data as T) : item;
            }),
          })),
        });
      });
    });
  }
}
