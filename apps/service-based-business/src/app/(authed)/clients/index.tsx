import { CurrentBrandClients } from '@symbiot-core-apps/brand-client';
import { router } from 'expo-router';

export default () => (
  <CurrentBrandClients
    onClientPress={(client) => router.push(`/clients/${client.id}/profile`)}
  />
);
