import { useBrandClientTransactionListReq } from '@symbiot-core-apps/api';
import { BrandTransactionsList } from './brand-transactions-list';

export const BrandClientTransactions = ({
  clientId,
  offsetTop,
}: {
  clientId: string;
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
  } = useBrandClientTransactionListReq(clientId);

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
