import { useTranslation } from 'react-i18next';
import {
  AnimatedList,
  Button,
  Chip,
  ContainerView,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  H3,
  InitView,
  NavigationBackground,
  PageView,
  RegularText,
  Search,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useApp } from '@symbiot-core-apps/app';
import { useCurrentBrandMembershipState } from '@symbiot-core-apps/state';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import {
  BrandMembership,
  useCurrentBrandMembershipListQuery,
} from '@symbiot-core-apps/api';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { emitHaptic, formatPrice } from '@symbiot-core-apps/shared';
import { View, XStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { useAllBrandLocation } from '@symbiot-core-apps/brand-location';

export const CurrentBrandMemberships = ({
  navigateTo,
}: {
  navigateTo: 'update' | 'profile';
}) => {
  const { currentList, setCurrentList } = useCurrentBrandMembershipState();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const allLocations = useAllBrandLocation();
  const headerHeight = useScreenHeaderHeight();

  const [search, setSearch] = useState('');

  const {
    items: memberships,
    isFetchingNextPage,
    isRefetching,
    isLoading,
    error,
    onRefresh,
    onEndReached,
  } = useCurrentBrandMembershipListQuery({
    initialState: currentList,
    setInitialState: setCurrentList,
    params: {
      ...(!!search && {
        search,
      }),
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: BrandMembership }) => (
      <View
        height={200}
        maxWidth={400}
        width="100%"
        marginHorizontal="auto"
        backgroundColor="#051529"
        borderRadius="$10"
        overflow="hidden"
        padding="$4"
        gap="$2"
        justifyContent="space-between"
        position="relative"
        cursor="pointer"
        opacity={item.hidden ? 0.7 : 1}
        pressStyle={{ opacity: 0.8 }}
        onPress={() => {
          emitHaptic();
          router.push(`/memberships/${item.id}/${navigateTo}`);
        }}
      >
        <LinearGradient
          colors={['#FFFFFF05', '#FFFFFF30', '#FFFFFF05']}
          start={{ x: 1, y: 1 }}
          end={{ x: -1, y: -1 }}
          style={StyleSheet.absoluteFill}
        />

        <XStack>
          <Chip label={item.validity?.label} size="small" />
        </XStack>

        <View gap="$1">
          <H3 numberOfLines={2} color="white" zIndex={1}>
            {item.name}
          </H3>
          {item.location !== undefined && (
            <RegularText color="$placeholderColor">
              {item.location?.name || allLocations.label}
            </RegularText>
          )}
        </View>

        {item.price ? (
          <XStack gap="$2" alignItems="center" alignSelf="flex-end">
            <RegularText color="white">
              {formatPrice({
                price: item.price,
                discount: item.discount,
                symbol: item.currency?.symbol,
              })}
            </RegularText>

            {!!item.discount && (
              <RegularText
                textDecorationLine="line-through"
                color="$placeholderColor"
              >
                {formatPrice({
                  price: item.price,
                  symbol: item.currency?.symbol,
                })}
              </RegularText>
            )}
          </XStack>
        ) : (
          <View alignSelf="flex-end">
            <RegularText color="white">{t('brand_service.free')}</RegularText>
          </View>
        )}
      </View>
    ),
    [allLocations.label, navigateTo, t],
  );

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
          refreshing={isRefetching && !isLoading}
          expanding={isFetchingNextPage}
          data={memberships}
          progressViewOffset={headerHeight}
          contentContainerStyle={{
            gap: 2,
            paddingTop: headerHeight,
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
        <NavigationBackground
          borderTopWidth={1}
          borderTopColor="$background1"
        />

        <Search
          value={search}
          debounce={300}
          placeholder={t('brand_membership.search.placeholder')}
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
          iconName={icons.Membership}
          title={t('brand_membership.create.intro.title')}
          message={t('brand_membership.create.intro.subtitle')}
        >
          <Button
            label={t('brand_membership.create.intro.button.label')}
            onPress={() => router.push('/memberships/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
