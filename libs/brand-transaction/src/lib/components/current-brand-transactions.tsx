import { useCurrentBrandTransactionListQuery } from '@symbiot-core-apps/api';
import { BrandTransactionsList } from './brand-transactions-list';

export const CurrentBrandTransactions = ({
  offsetTop,
}: {
  offsetTop?: number;
}) => {
  const {
    items: transactions,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useCurrentBrandTransactionListQuery();

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
