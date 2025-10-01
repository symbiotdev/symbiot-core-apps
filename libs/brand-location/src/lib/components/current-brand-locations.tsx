import {
  AnimatedList,
  Button,
  EmptyView,
  InitView,
  PageView,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import {
  BrandLocation,
  useCurrentBrandLocationsQuery,
} from '@symbiot-core-apps/api';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandLocationItem } from '@symbiot-core-apps/brand';

export const CurrentBrandLocations = ({
  onLocationPress,
}: {
  onLocationPress: (location: BrandLocation) => void;
}) => {
  const { brand } = useCurrentBrandState();
  const headerHeight = useScreenHeaderHeight();
  const { data, isLoading, isRefetching, error, refetch } =
    useCurrentBrandLocationsQuery();

  const locations = useMemo(
    () => data?.items || brand?.locations,
    [data?.items, brand?.locations],
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
        renderItem={({ item }) => (
          <BrandLocationItem
            backgroundColor="$background1"
            borderRadius="$10"
            padding="$4"
            location={item}
            brand={brand}
            onPress={() => onLocationPress(item)}
          />
        )}
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
          title={t('brand_location.create.intro.title')}
          message={t('brand_location.create.intro.subtitle')}
        >
          <Button
            label={t('brand_location.create.intro.button.label')}
            onPress={() => router.push('/locations/create')}
          />
        </EmptyView>
      </PageView>
    );
  }
};
