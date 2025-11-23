import { Redirect, Stack } from 'expo-router';
import { useAuthTokens } from '@symbiot-core-apps/api';
import {
  useCurrentAccountState,
  useCurrentBrandBookingsState,
  useCurrentBrandEmployeeState,
  useCurrentBrandState,
  useFaqState,
  useOnboardingState,
} from '@symbiot-core-apps/state';
import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { Platform } from 'react-native';
import { useEffect } from 'react';
import { hideAsync } from 'expo-splash-screen';
import { changeAppLanguageToSystem } from '@symbiot-core-apps/i18n';

export default () => {
  const { tokens } = useAuthTokens();
  const { finished: onboardingFinished } = useOnboardingState();
  const { clear: clearCurrentAccountState } = useCurrentAccountState();
  const { clear: clearCurrentBrandState } = useCurrentBrandState();
  const { clear: clearCurrentBrandBookingsState } =
    useCurrentBrandBookingsState();
  const { clear: clearCurrentBrandEmployeeState } =
    useCurrentBrandEmployeeState();
  const { clear: clearFaq } = useFaqState();
  const headerScreenOptions = useStackScreenHeaderOptions();

  useEffect(() => {
    if (!tokens.access) {
      void hideAsync();
      changeAppLanguageToSystem();

      clearCurrentAccountState();
      clearCurrentBrandState();
      clearCurrentBrandBookingsState();
      clearCurrentBrandEmployeeState();
      clearFaq();
    }
  }, [
    tokens.access,
    clearCurrentAccountState,
    clearCurrentBrandState,
    clearCurrentBrandBookingsState,
    clearCurrentBrandEmployeeState,
    clearFaq,
  ]);

  if (tokens.access) {
    return <Redirect href="/home" />;
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
