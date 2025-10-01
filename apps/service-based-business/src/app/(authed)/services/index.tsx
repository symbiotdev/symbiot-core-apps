import { CurrentBrandServices } from '@symbiot-core-apps/brand-service';
import { router } from 'expo-router';

export default () => (
  <CurrentBrandServices
    onServicePress={(service) => router.push(`/services/${service.id}/profile`)}
  />
);
