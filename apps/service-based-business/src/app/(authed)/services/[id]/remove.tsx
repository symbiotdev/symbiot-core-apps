import { InitView } from '@symbiot-core-apps/ui';
import { useBrandServiceProfileByIdQuery } from '@symbiot-core-apps/api';
import { useLocalSearchParams } from 'expo-router';
import { RemoveBrandService } from '@symbiot-core-apps/brand-service';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: service,
    isPending,
    error,
  } = useBrandServiceProfileByIdQuery(id, false);

  if (!service || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <RemoveBrandService service={service} />;
};
