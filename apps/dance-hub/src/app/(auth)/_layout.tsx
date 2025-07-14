import { Stack } from 'expo-router';
import { authStackScreenOptions } from '@symbiot-core-apps/auth';

export default () => {
  return (
    <Stack screenOptions={authStackScreenOptions}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth"
        options={{ headerShown: false, animation: 'none' }}
      />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
};
