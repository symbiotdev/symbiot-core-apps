import { Redirect, Stack } from 'expo-router';
import { useAuthTokens } from '@symbiot-core-apps/api';
import {
  useCurrentBrandState,
  useOnboardingState,
} from '@symbiot-core-apps/state';
import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { Platform } from 'react-native';

export default () => {
  const { tokens } = useAuthTokens();
  const { finished: onboardingFinished } = useOnboardingState();
  const { brand: currentBrand } = useCurrentBrandState();
  const headerScreenOptions = useStackScreenHeaderOptions();

  if (tokens.access) {
    return <Redirect href={currentBrand ? '/home' : '/brand'} />;
  }

  return (
    <Stack
      screenOptions={{
        ...headerScreenOptions,
        headerShown: Platform.OS !== 'web',
      }}
    >
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
