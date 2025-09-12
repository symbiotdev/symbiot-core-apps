export type PaginationList<E> = {
  items: E[];
  count: number;
};

export type PaginationListParams = {
  take?: number;
  orderBy?: string;
  sortDirection?: 'DESC' | 'ASC';
  search?: string;
};
