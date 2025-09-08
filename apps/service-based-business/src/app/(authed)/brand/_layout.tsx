import { Stack } from 'expo-router';
import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';

export default () => {
  const { brands: currentBrands } = useCurrentBrandState();
  const { hasPermission, hasAnyPermission } = useCurrentBrandEmployee();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!!currentBrands && !currentBrands.length}>
        <Stack.Screen name="create" />
      </Stack.Protected>

      <Stack.Protected guard={hasAnyPermission()}>
        <Stack.Screen name="menu" />

        <Stack.Protected guard={hasPermission('brandAll')}>
          <Stack.Screen name="preferences" />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
};
