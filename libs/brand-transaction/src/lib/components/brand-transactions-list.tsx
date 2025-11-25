import {
  AnimatedList,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  InitView,
} from '@symbiot-core-apps/ui';
import { BrandTransactionItem } from '@symbiot-core-apps/brand';
import { BrandTransaction } from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const BrandTransactionsList = ({
  transactions,
  offsetTop,
  isLoading,
  isRefetching,
  isFetchingNextPage,
  error,
  onRefresh,
  onEndReached,
}: {
  transactions?: BrandTransaction[];
  offsetTop?: number;
  isLoading?: boolean;
  isRefetching?: boolean;
  isFetchingNextPage?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onEndReached?: () => void;
}) => {
  const { t } = useTranslation();
  const ListEmptyComponent = useCallback(() => <EmptyView />, []);

  if (!transactions?.length) {
    return (
      <InitView
        loading={isLoading}
        error={error}
        noDataIcon="Bill"
        noDataTitle={t('brand_transaction.empty.title')}
        noDataMessage={t('brand_transaction.empty.subtitle')}
      />
    );
  }

  return (
    <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
      <AnimatedList
        keyboardDismissMode="on-drag"
        refreshing={isRefetching}
        expanding={isFetchingNextPage}
        data={transactions}
        progressViewOffset={offsetTop}
        contentContainerStyle={{
          gap: 4,
          paddingTop: offsetTop,
          paddingHorizontal: defaultPageHorizontalPadding,
          paddingBottom: 100,
        }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item }) => (
          <BrandTransactionItem
            backgroundColor="$background1"
            borderRadius="$10"
            alignSelf="center"
            padding="$4"
            transaction={item}
          />
        )}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
      />
    </ContainerView>
  );
};
