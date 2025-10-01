import { CurrentBrandLocations } from '@symbiot-core-apps/brand-location';
import { router } from 'expo-router';

export default () => (
  <CurrentBrandLocations
    onLocationPress={(location) =>
      router.push(`/locations/${location.id}/profile`)
    }
  />
);
