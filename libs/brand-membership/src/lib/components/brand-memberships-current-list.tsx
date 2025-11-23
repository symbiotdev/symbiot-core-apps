import { useTranslation } from 'react-i18next';
import {
  AnimatedList,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  NavigationBackground,
  Search,
} from '@symbiot-core-apps/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, {
  ComponentType,
  ReactElement,
  useCallback,
  useState,
} from 'react';
import {
  AnyBrandMembership,
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
  InfiniteQuery,
  PaginationListParams,
} from '@symbiot-core-apps/api';
import { KeyboardStickyView } from 'react-native-keyboard-controller';

export const BrandMembershipsCurrentList = ({
  offsetTop,
  type,
  withHidden,
  query,
  renderItem,
  Intro,
}: {
  offsetTop?: number;
  withHidden?: boolean;
  type: BrandMembershipType;
  query: (props?: {
    params?: PaginationListParams & { hidden?: boolean };
  }) => InfiniteQuery<AnyBrandMembership>;
  renderItem: (props: { item: AnyBrandMembership }) => ReactElement;
  Intro: ComponentType<{ loading?: boolean; error?: string | null }>;
}) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const tPrefix = getTranslateKeyByBrandMembershipType(type);

  const [search, setSearch] = useState('');

  const {
    items: memberships,
    isFetchingNextPage,
    isManualRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = query({
    params: {
      hidden: withHidden,
      ...(!!search && {
        search,
      }),
    },
  });

  const ListEmptyComponent = useCallback(
    () => <EmptyView iconName="Magnifer" message={t('shared.nothing_found')} />,
    [t],
  );

  if (!memberships?.length && !search) {
    return <Intro loading={isLoading} error={error} />;
  }

  return (
    <>
      <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
        <AnimatedList
          keyboardDismissMode="on-drag"
          refreshing={isManualRefetching}
          expanding={isFetchingNextPage}
          data={memberships}
          progressViewOffset={offsetTop}
          contentContainerStyle={{
            gap: 4,
            paddingTop: offsetTop,
            paddingHorizontal: defaultPageHorizontalPadding,
            paddingBottom: 100,
          }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={renderItem}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
        />
      </ContainerView>

      <KeyboardStickyView
        offset={{ opened: bottom }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          paddingTop: 10,
          paddingBottom: bottom + 10,
          paddingHorizontal: defaultPageHorizontalPadding,
          width: '100%',
          zIndex: 1,
        }}
      >
        <NavigationBackground backgroundColor="$background1" />

        <Search
          value={search}
          debounce={300}
          placeholder={t(`${tPrefix}.search.placeholder`)}
          inputFieldProps={{ backgroundColor: '$background' }}
          onChange={setSearch}
        />
      </KeyboardStickyView>
    </>
  );
};
