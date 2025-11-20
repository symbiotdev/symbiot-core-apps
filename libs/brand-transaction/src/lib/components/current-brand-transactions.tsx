import { useCurrentBrandTransactionListReq } from '@symbiot-core-apps/api';
import { BrandTransactionsList } from './brand-transactions-list';

export const CurrentBrandTransactions = ({
  offsetTop,
}: {
  offsetTop?: number;
}) => {
  const {
    items: transactions,
    isFetchingNextPage,
    isManualRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useCurrentBrandTransactionListReq();

  return (
    <BrandTransactionsList
      transactions={transactions}
      offsetTop={offsetTop}
      isLoading={isLoading}
      isRefetching={isManualRefetching}
      isFetchingNextPage={isFetchingNextPage}
      error={error}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
    />
  );
};
