import {
  HeaderButton,
  useStackScreenHeaderOptions,
} from '@symbiot-core-apps/ui';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';

const IndexHeaderRight = () => {
  const { hasPermission } = useCurrentBrandEmployee();

  return (
    hasPermission('clientsAll') && (
      <HeaderButton
        iconName="AddCircle"
        onPress={() => router.push('/brand/create')}
      />
    )
  );
};

export default () => {
  const { t } = useTranslation();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t('brand.clients.title'),
          headerRight: IndexHeaderRight,
        }}
      />
    </Stack>
  );
};
