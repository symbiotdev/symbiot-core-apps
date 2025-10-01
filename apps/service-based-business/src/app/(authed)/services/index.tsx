import { CurrentBrandServices } from '@symbiot-core-apps/brand-service';
import { router } from 'expo-router';
import { useScreenHeaderHeight } from '@symbiot-core-apps/ui';

export default () => {
  const headerHeight = useScreenHeaderHeight();

  return (
    <CurrentBrandServices
      offsetTop={headerHeight}
      onServicePress={(service) =>
        router.push(`/services/${service.id}/profile`)
      }
    />
  );
};
