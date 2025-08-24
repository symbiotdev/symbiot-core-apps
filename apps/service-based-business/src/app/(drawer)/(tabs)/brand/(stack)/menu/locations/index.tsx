import { CurrentBrandLocations } from '@symbiot-core-apps/brand-location';
import { Redirect } from 'expo-router';
import { useCurrentBrandLocationsQuery } from '@symbiot-core-apps/api';
import { LoadingView } from '@symbiot-core-apps/ui';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { useMemo } from 'react';

export default () => {
  const { data } = useCurrentBrandLocationsQuery();
  const { brand } = useCurrentBrandState();

  const locations = useMemo(
    () => data?.items || brand?.locations,
    [data?.items, brand?.locations],
  );

  if (!locations) {
    return <LoadingView />;
  }

  if (!locations.length) {
    return <Redirect href="/brand/location/create" />;
  }

  return <CurrentBrandLocations locations={locations} />;
};
