import { Redirect, Stack } from 'expo-router';
import { authStackScreenOptions } from '@symbiot-core-apps/auth';
import { useAuthTokens } from '@symbiot-core-apps/api';
import { useOnboardingState } from '@symbiot-core-apps/state';

export default () => {
  const { tokens } = useAuthTokens();
  const { finished: onboardingFinished } = useOnboardingState();

  if (tokens.access) {
    return <Redirect href="/verifying" />;
  }

  return (
    <Stack screenOptions={authStackScreenOptions}>
      <Stack.Protected guard={!onboardingFinished}>
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!!onboardingFinished}>
        <Stack.Screen
          name="auth/index"
          options={{ headerShown: false, animation: 'none' }}
        />
        <Stack.Screen name="forgot-password/[secret]/verify" />
        <Stack.Screen name="forgot-password/index" />
        <Stack.Screen name="reset-password/[secret]/index" />
        <Stack.Screen name="sign-up/[secret]/verify" />
        <Stack.Screen name="sign-up/index" />
        <Stack.Screen name="sign-in/index" />
      </Stack.Protected>
    </Stack>
  );
};
