import { RemoveBrandLocation } from '@symbiot-core-apps/brand-location';
import { useLocalSearchParams } from 'expo-router';
import { useBrandLocationByIdQuery } from '@symbiot-core-apps/api';
import { InitView } from '@symbiot-core-apps/ui';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: location,
    error,
    isPending,
  } = useBrandLocationByIdQuery(id, false);

  if (!location || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <RemoveBrandLocation location={location} />;
};
