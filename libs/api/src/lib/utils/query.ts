import { PaginationList } from '../types/pagination';
import type { InfiniteData } from '@tanstack/query-core';
import { queryClient } from './client';

export function getNextPageParam<T>(page: PaginationList<T>) {
  return page.items.length < page.count
    ? page.items[page.items.length - 1]
    : undefined;
}

export async function refetchQueriesByChanges<T extends { id: string }>({
  queryKeys,
  entity,
  refetchList,
}: {
  queryKeys: {
    byId: string;
    list: string;
  };
  entity: T;
  refetchList: boolean;
}) {
  queryClient.setQueryData([queryKeys.byId, entity.id], entity);

  if (refetchList) {
    await queryClient.refetchQueries({
      queryKey: [queryKeys.list],
    });
  } else {
    const data = queryClient.getQueryData<InfiniteData<PaginationList<T>>>([
      queryKeys.list,
    ]);

    if (data) {
      queryClient.setQueryData<InfiniteData<PaginationList<T>>>(
        [queryKeys.list],
        {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === entity.id ? entity : item,
            ),
          })),
        },
      );
    }
  }
}
