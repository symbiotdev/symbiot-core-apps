import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { Stack } from 'expo-router';
import { useCurrentBrandState } from '@symbiot-core-apps/state';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: currentBrand?.name,
        }}
      />
    </Stack>
  );
};
