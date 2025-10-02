import { useCurrentBrandTransactionState } from '@symbiot-core-apps/state';
import { useCurrentBrandTransactionListQuery } from '@symbiot-core-apps/api';
import { BrandTransactionsList } from './brand-transactions-list';

export const CurrentBrandTransactions = ({
  offsetTop,
}: {
  offsetTop?: number;
}) => {
  const { currentList, setCurrentList } = useCurrentBrandTransactionState();

  const {
    items: transactions,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useCurrentBrandTransactionListQuery({
    initialState: currentList,
    setInitialState: setCurrentList,
  });

  return (
    <BrandTransactionsList
      transactions={transactions}
      offsetTop={offsetTop}
      isLoading={isLoading}
      isRefetching={isRefetching}
      isFetchingNextPage={isFetchingNextPage}
      error={error}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
    />
  );
};
