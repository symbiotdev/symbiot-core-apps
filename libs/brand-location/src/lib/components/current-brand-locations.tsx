import {
  AnimatedList,
  Avatar,
  FormView,
  Icon,
  InitView,
  PageView,
  RegularText,
  SemiBoldText,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { View } from 'tamagui';
import { emitHaptic } from '@symbiot-core-apps/shared';
import {
  BrandLocation,
  useCurrentBrandLocationsQuery,
} from '@symbiot-core-apps/api';
import { Redirect, router } from 'expo-router';
import { useCallback, useMemo } from 'react';

export const CurrentBrandLocations = () => {
  const { brand } = useCurrentBrandState();
  const headerHeight = useScreenHeaderHeight();
  const { data, isLoading, isRefetching, error, refetch } =
    useCurrentBrandLocationsQuery();

  const locations = useMemo(
    () => data?.items || brand?.locations,
    [data?.items, brand?.locations],
  );

  const renderItem = useCallback(
    ({ item }: { item: BrandLocation }) => (
      <FormView
        alignItems="center"
        backgroundColor="$background1"
        borderRadius="$10"
        padding="$4"
        gap="$4"
        cursor="pointer"
        flexDirection="row"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => {
          emitHaptic();
          router.push(`/location/update/${item.id}`);
        }}
      >
        <Avatar
          name={item.name}
          size={40}
          url={item.avatarXsUrl || brand?.avatarXsUrl}
        />

        <View gap="$1" flex={1}>
          <SemiBoldText numberOfLines={1}>{item.name}</SemiBoldText>
          <RegularText color="$placeholderColor" numberOfLines={1}>
            {item.address}
          </RegularText>
        </View>

        <Icon name="ArrowRight" />
      </FormView>
    ),
    [brand?.avatarXsUrl],
  );

  if (!locations) {
    return <InitView loading={isLoading} error={error} />;
  }

  if (!locations.length) {
    return <Redirect href="/location/create" />;
  }

  return (
    <PageView ignoreTopSafeArea ignoreBottomSafeArea paddingBottom={0}>
      <AnimatedList
        refreshing={isRefetching && !isLoading}
        data={locations}
        progressViewOffset={headerHeight}
        contentContainerStyle={{
          gap: 2,
          paddingTop: headerHeight,
          paddingBottom: 100,
        }}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onRefresh={refetch}
      />
    </PageView>
  );
};
