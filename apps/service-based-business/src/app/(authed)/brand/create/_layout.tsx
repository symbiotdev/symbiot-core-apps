import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { Stack } from 'expo-router';

export default () => {
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
};
