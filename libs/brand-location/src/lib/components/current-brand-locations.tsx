import {
  AnimatedList,
  Avatar,
  Button,
  EmptyView,
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
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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
          router.push(`/locations/${item.id}/update`);
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

  if (!locations?.length) {
    return <Intro loading={isLoading} error={error} />;
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

const Intro = ({
  loading,
  error,
}: {
  loading?: boolean;
  error?: string | null;
}) => {
  const { t } = useTranslation();

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
          iconName="MapPointWave"
          title={t('brand.locations.upsert.intro.title')}
          message={t('brand.locations.upsert.intro.subtitle')}
        >
          <Button
            label={t('brand.locations.upsert.intro.button.label')}
            onPress={() => router.push('/locations/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
