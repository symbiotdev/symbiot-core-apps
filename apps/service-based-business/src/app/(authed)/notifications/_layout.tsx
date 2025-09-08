import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t('shared.notifications.title'),
        }}
      />
    </Stack>
  );
};
