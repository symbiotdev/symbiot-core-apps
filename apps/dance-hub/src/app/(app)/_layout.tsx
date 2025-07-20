import { Redirect, Stack } from 'expo-router';
import { useAuthTokens } from '@symbiot-core-apps/api';
import { useMe } from '@symbiot-core-apps/store';

export default () => {
  const { tokens } = useAuthTokens();

  useMe({ autoFetch: true });

  if (!tokens.access) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack
      initialRouteName="verifying/index"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="verifying/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};
