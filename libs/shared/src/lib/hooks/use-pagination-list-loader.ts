import { useFocusEffect } from 'expo-router';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getRequestErrorMessage } from '../utils/request';
import { ShowNativeFailedAlert } from '../utils/burnt';
import { useRestoreApp } from './use-app-state';

export interface PaginationParams<T> {
  [key: string]: unknown;

  take?: number;
  after?: Partial<T>;
  orderBy?: string;
  sortDirection?: 'DESC' | 'ASC';
  search?: string;
}

export interface PaginationList<T> {
  count: number;
  items: T[];
}

export interface RenderPaginationList<E> {
  items: E[];
  count: number;
  canLoadMore: boolean;
}

export enum PaginationEmptyState {
  empty,
  emptySearch,
  loading,
  error,
}

export function usePaginationListLoader<T, P extends PaginationParams<T>>({
  api$,
  searchApi$,
  showAlertError,
  reloadOnInit,
  reloadOnFocus,
  reloadOnRestore,
  initialParams,
  afterRequestKeys,
  list,
  EmptyListByState,
  onListUpdated,
  onFocus,
}: {
  api$: (params: P) => Promise<PaginationList<T>>;
  searchApi$?: (params: P) => Promise<PaginationList<T>>;
  list?: RenderPaginationList<T>;
  showAlertError?: boolean;
  afterRequestKeys?: (keyof T)[];
  reloadOnInit?: boolean;
  reloadOnFocus?: boolean;
  reloadOnRestore?: boolean;
  initialParams?: P;
  EmptyListByState?: Record<
    PaginationEmptyState,
    (params: { error?: string }) => ReactNode | null
  >;
  onListUpdated?: (list: RenderPaginationList<T>, params: P) => void;
  onFocus?: () => void;
}) {
  const [error, setError] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [foundList, setFoundList] = useState<RenderPaginationList<T>>();

  const listRef = useRef(list);
  const hasEntities$ = useRef(!!list?.items?.length);
  const requestParams = useRef({
    ...initialParams,
  } as P);

  const targetList = useMemo(
    () => (searchQuery ? foundList : list),
    [searchQuery, foundList, list],
  );

  const emptyState = useMemo(() => {
    if (targetList && error) {
      return PaginationEmptyState.error;
    } else if (targetList && !searchQuery && !searching && !filtering) {
      return PaginationEmptyState.empty;
    } else if (!!searchQuery && !searching && !filtering) {
      return PaginationEmptyState.emptySearch;
    }

    return PaginationEmptyState.loading;
  }, [error, targetList, searchQuery, searching, filtering]);

  const request$ = useCallback(async () => {
    const params = { ...requestParams.current };

    try {
      setError(undefined);

      const response = await (params.search && !!searchApi$
        ? searchApi$(params)
        : api$(params));

      if (params?.search) {
        setFoundList((prev) => updatePaginationList(params, response, prev));
      } else {
        onListUpdated?.(
          updatePaginationList(params, response, listRef.current),
          params,
        );
      }
    } catch (error) {
      const errorText = getRequestErrorMessage(error);

      if (!params.after && !hasEntities$.current) {
        if (params?.search) {
          setFoundList({ items: [], count: 0, canLoadMore: false });
        } else {
          onListUpdated?.(
            updatePaginationList(params, { items: [], count: 0 }),
            params,
          );
        }
      }

      setError(getRequestErrorMessage(errorText));

      if (showAlertError) {
        ShowNativeFailedAlert({
          text: errorText,
        });
      }
    }
  }, [api$, searchApi$, onListUpdated, showAlertError]);

  const reload$ = useCallback(async () => {
    requestParams.current = {
      ...initialParams,
      // take: listRef.current?.items?.length,
    } as P;

    setLoading(true);

    try {
      await request$();
    } finally {
      setLoading(false);
    }
  }, [initialParams, request$]);

  const search$ = useCallback(
    async (query: string) => {
      requestParams.current = {
        ...requestParams.current,
        after: undefined,
        search: query ? query : undefined,
      };

      setSearchQuery(query);

      if (!query) {
        setFoundList(undefined);
      } else {
        setSearching(true);

        try {
          await request$();
        } finally {
          setSearching(false);
        }
      }
    },
    [request$],
  );

  const refresh$ = useCallback(async () => {
    requestParams.current = {
      ...requestParams.current,
      after: undefined,
    };

    setRefreshing(true);

    try {
      await request$();
    } finally {
      setRefreshing(false);
    }
  }, [request$]);

  const expand$ = useCallback(async () => {
    const targetListItems = targetList?.items;

    if (
      refreshing ||
      expanding ||
      !targetListItems ||
      !targetList?.canLoadMore
    ) {
      return;
    }

    const lastItem = targetListItems[targetListItems.length - 1];

    requestParams.current = {
      ...requestParams.current,
      after: afterRequestKeys
        ? afterRequestKeys.reduce(
            (obj, key) => ({
              ...obj,
              [key]: lastItem[key as keyof T],
            }),
            {},
          )
        : {
            id: lastItem['id' as keyof T],
          },
    };

    setExpanding(true);

    try {
      await request$();
    } finally {
      setExpanding(false);
    }
  }, [
    targetList?.items,
    targetList?.canLoadMore,
    refreshing,
    expanding,
    request$,
    afterRequestKeys,
  ]);

  const filter$ = useCallback(
    async (params: P) => {
      requestParams.current = {
        ...requestParams.current,
        ...params,
        after: undefined,
      };

      setFoundList(undefined);
      setFiltering(true);

      try {
        await request$();
      } finally {
        setFiltering(false);
      }
    },
    [request$],
  );

  const ListEmptyComponent = useCallback(
    () =>
      EmptyListByState?.[emptyState]
        ? EmptyListByState[emptyState]({ error })
        : null,
    [EmptyListByState, emptyState, error],
  );

  useFocusEffect(
    useCallback(() => {
      if (reloadOnFocus) {
        void reload$();
      }

      onFocus?.();
    }, [onFocus, reload$, reloadOnFocus]),
  );

  useRestoreApp(() => {
    if (reloadOnRestore) {
      void reload$();
    }
  });

  useEffect(() => {
    listRef.current = list;
    hasEntities$.current = !!targetList?.items?.length;
  }, [list, targetList?.items?.length]);

  useEffect(() => {
    if (reloadOnInit && !reloadOnFocus) {
      void reload$();
    }
  }, []);

  return {
    search$,
    refresh$,
    expand$,
    filter$,
    searchQuery,
    loading,
    searching,
    expanding,
    refreshing,
    filtering,
    error,
    emptyState,
    entities: targetList?.items,
    canLoadMore: !!targetList?.canLoadMore,
    canSearch: !!targetList?.items?.length || searchQuery,
    ListEmptyComponent,
  };
}

export const updatePaginationList = <E, T>(
  params: PaginationParams<T>,
  newList: PaginationList<E>,
  currentList?: PaginationList<E>,
) => {
  return {
    count: newList.count,
    canLoadMore: newList.items.length < newList.count,
    items: params.after
      ? [...(currentList?.items || []), ...newList.items]
      : newList.items,
  };
};
