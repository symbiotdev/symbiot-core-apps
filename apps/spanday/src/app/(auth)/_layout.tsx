import { Stack } from 'expo-router';

const screenOptions = {
  headerShown: false,
};

export default () => {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="onboarding" />
    </Stack>
  );
};
