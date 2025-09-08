import { Stack } from 'expo-router';
import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';

export default () => {
  const { hasPermission, hasAnyPermission } = useCurrentBrandEmployee();
  const screenOptions = useStackScreenHeaderOptions();
  const { brands: currentBrands } = useCurrentBrandState();

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

        <Stack.Protected guard={hasPermission('clientsAll')}>
          <Stack.Screen name="client" />
          <Stack.Screen name="clients" />
        </Stack.Protected>

        <Stack.Protected guard={hasPermission('employeesAll')}>
          <Stack.Screen name="employee" />
          <Stack.Screen name="employees" />
        </Stack.Protected>

        <Stack.Protected guard={hasPermission('locationsAll')}>
          <Stack.Screen name="location" />
          <Stack.Screen name="locations" />
        </Stack.Protected>

        <Stack.Protected guard={hasPermission('brandAll')}>
          <Stack.Screen name="preferences" />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
};
