import { useStackScreenHeaderOptions } from '@symbiot-core-apps/ui';
import { Stack } from 'expo-router';

export default () => {
  const screenOptions = useStackScreenHeaderOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="create/index"
        options={{
          gestureEnabled: false,
        }}
      />
      {/*<Stack.Screen name="(stack)/client/remove/[id]" />*/}
      {/*<Stack.Screen*/}
      {/*  name="(stack)/client/update/[id]"*/}
      {/*  options={{*/}
      {/*    headerTitle: t('brand.clients.update.title'),*/}
      {/*    headerRight: UpdateClientHeaderRight,*/}
      {/*  }}*/}
      {/*/>*/}
    </Stack>
  );
};
