import { CurrentBrandClients } from '@symbiot-core-apps/brand-client';
import { router } from 'expo-router';
import { useScreenHeaderHeight } from '@symbiot-core-apps/ui';

export default () => {
  const headerHeight = useScreenHeaderHeight();

  return (
    <CurrentBrandClients
      offsetTop={headerHeight}
      onClientPress={(client) => router.push(`/clients/${client.id}/profile`)}
    />
  );
};
