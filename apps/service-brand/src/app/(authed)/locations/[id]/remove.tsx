import { RemoveBrandLocation } from '@symbiot-core-apps/brand-location';
import { useLocalSearchParams } from 'expo-router';
import { useBrandLocationByIdReq } from '@symbiot-core-apps/api';
import { FallbackView } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: location,
    error,
    isPending,
  } = useBrandLocationByIdReq(id, false);

  if (!location || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <RemoveBrandLocation location={location} />;
};
