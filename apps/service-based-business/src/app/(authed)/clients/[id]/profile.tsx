import { InitView } from '@symbiot-core-apps/ui';
import { BrandClientProfile } from '@symbiot-core-apps/brand-client';
import { useLocalSearchParams } from 'expo-router';
import { useBrandClientDetailedByIdQuery } from '@symbiot-core-apps/api';

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

  return <BrandClientProfile client={client} />;
};
