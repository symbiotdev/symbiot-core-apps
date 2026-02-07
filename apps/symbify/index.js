import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

registerRootComponent(() => (
  <ExpoRoot context={require.context('./src/app')} />
));
