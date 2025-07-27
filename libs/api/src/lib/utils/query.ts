import { PaginationList } from '../types/pagination';

export function getNextPageParam<T>(page: PaginationList<T>) {
  return page.items.length < page.count
    ? page.items[page.items.length - 1]
    : undefined;
}
