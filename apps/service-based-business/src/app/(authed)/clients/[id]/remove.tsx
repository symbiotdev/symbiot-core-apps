import { useLocalSearchParams } from 'expo-router';
import { useBrandClientDetailedByIdQuery } from '@symbiot-core-apps/api';
import { InitView } from '@symbiot-core-apps/ui';
import { RemoveBrandClient } from '@symbiot-core-apps/brand-client';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: client,
    error,
    isPending,
  } = useBrandClientDetailedByIdQuery(id);

  if (!client || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <RemoveBrandClient client={client} />;
};
