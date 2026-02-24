import { BrandTransactionItem } from '@symbiot-core-apps/brand';
import { BrandTransaction } from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';
import {
  AnimatedList,
  Container,
  EmptyView,
  FallbackView,
  PAGE_STYLE,
} from '@symbiot-core-apps/ui2';

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
  const { t } = useI18n();

  if (!transactions?.length) {
    return (
      <FallbackView
        loading={isLoading}
        error={error}
        noDataIcon="Bill"
        noDataTitle={t('brand_transaction.empty.title')}
        noDataMessage={t('brand_transaction.empty.subtitle')}
      />
    );
  }

  return (
    <Container style={{ flex: 1, paddingVertical: PAGE_STYLE.paddingVertical }}>
      <AnimatedList
        keyboardDismissMode="on-drag"
        refreshing={isRefetching}
        expanding={isFetchingNextPage}
        data={transactions}
        progressViewOffset={offsetTop}
        contentContainerStyle={{
          gap: 4,
          paddingTop: offsetTop,
          paddingHorizontal: PAGE_STYLE.paddingHorizontal,
          paddingBottom: 100,
        }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyView}
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
    </Container>
  );
};
