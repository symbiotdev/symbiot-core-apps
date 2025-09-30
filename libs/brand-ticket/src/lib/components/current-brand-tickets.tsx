import { useTranslation } from 'react-i18next';
import {
  AnimatedList,
  Button,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  InitView,
  NavigationBackground,
  PageView,
  Search,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useApp } from '@symbiot-core-apps/app';
import { useCurrentBrandTicketState } from '@symbiot-core-apps/state';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { BrandTicketItem } from '@symbiot-core-apps/brand';
import { useCurrentBrandTicketListQuery } from '@symbiot-core-apps/api';

export const CurrentBrandTickets = ({
  navigateTo,
}: {
  navigateTo: 'update' | 'profile';
}) => {
  const { currentList, setCurrentList } = useCurrentBrandTicketState();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useScreenHeaderHeight();

  const [search, setSearch] = useState('');

  const {
    items: tickets,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useCurrentBrandTicketListQuery({
    initialState: currentList,
    setInitialState: setCurrentList,
    params: {
      ...(!!search && {
        search,
      }),
    },
  });

  const ListEmptyComponent = useCallback(
    () => <EmptyView iconName="Magnifer" message={t('shared.nothing_found')} />,
    [t],
  );

  if (!tickets?.length && !search) {
    return <Intro loading={isLoading} error={error} />;
  }

  return (
    <>
      <ContainerView flex={1} paddingVertical={defaultPageVerticalPadding}>
        <AnimatedList
          keyboardDismissMode="on-drag"
          refreshing={isRefetching && !isLoading}
          expanding={isFetchingNextPage}
          data={tickets}
          progressViewOffset={headerHeight}
          contentContainerStyle={{
            gap: 8,
            paddingTop: headerHeight,
            paddingHorizontal: defaultPageHorizontalPadding,
            paddingBottom: 100,
          }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({ item }) => (
            <BrandTicketItem
              alignSelf="center"
              ticket={item}
              navigateTo={navigateTo}
            />
          )}
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
        <NavigationBackground
          borderTopWidth={1}
          borderTopColor="$background1"
        />

        <Search
          value={search}
          debounce={300}
          placeholder={t('brand_ticket.search.placeholder')}
          inputFieldProps={{ backgroundColor: '$background' }}
          onChange={setSearch}
        />
      </KeyboardStickyView>
    </>
  );
};

const Intro = ({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string | null;
}) => {
  const { t } = useTranslation();
  const { icons } = useApp();

  if (loading || error) {
    return <InitView loading={loading} error={error} />;
  } else {
    return (
      <PageView
        scrollable
        animation="medium"
        opacity={1}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      >
        <EmptyView
          padding={0}
          iconName={icons.Ticket}
          title={t('brand_ticket.create.intro.title')}
          message={t('brand_ticket.create.intro.subtitle')}
        >
          <Button
            label={t('brand_ticket.create.intro.button.label')}
            onPress={() => router.push('/tickets/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
