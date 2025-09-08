import {
  H3,
  HeaderButton,
  headerButtonSize,
  useDrawer,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { router, Stack } from 'expo-router';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';

const IndexHeaderLeft = () => {
  const { brand } = useCurrentBrandState();

  return (
    brand && (
      <H3 lineHeight={headerButtonSize} numberOfLines={1}>
        {brand.name}
      </H3>
    )
  );
};

const IndexHeaderRight = () => {
  const { hasAnyPermission } = useCurrentBrandEmployee();
  const { visible } = useDrawer();

  return (
    hasAnyPermission() && (
      <HeaderButton
        iconName="SettingsMinimalistic"
        onPress={() =>
          visible ? router.replace('/brand/menu') : router.push('/brand/menu')
        }
      />
    )
  );
};

export default () => {
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerLeft: IndexHeaderLeft,
          headerRight: IndexHeaderRight,
        }}
      />
    </Stack>
  );
};
