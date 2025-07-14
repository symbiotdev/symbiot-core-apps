import { Stack } from 'expo-router';
import { authStackScreenOptions } from '@symbiot-core-apps/auth';

export default () => {
  return (
    <Stack screenOptions={authStackScreenOptions}>
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth/index"
        options={{ headerShown: false, animation: 'none' }}
      />
      <Stack.Screen name="forgot-password/index" />
      <Stack.Screen name="sign-up/index" />
      <Stack.Screen name="sign-up/[secret]/verify" />
      <Stack.Screen name="sign-in/index" />
    </Stack>
  );
};
