import { Redirect, Stack } from 'expo-router';
import { useAuthTokens } from '@symbiot-core-apps/api';

export default () => {
  const { tokens } = useAuthTokens();

  if (!tokens.access) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack initialRouteName="verifying/index">
      <Stack.Screen
        name="verifying/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};
