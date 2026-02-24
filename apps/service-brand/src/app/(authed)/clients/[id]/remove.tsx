import { useLocalSearchParams } from 'expo-router';
import { useBrandClientDetailedByIdReq } from '@symbiot-core-apps/api';
import { RemoveBrandClient } from '@symbiot-core-apps/brand-client';
import { FallbackView } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: client,
    error,
    isPending,
  } = useBrandClientDetailedByIdReq(id, false);

  if (!client || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <RemoveBrandClient client={client} />;
};
