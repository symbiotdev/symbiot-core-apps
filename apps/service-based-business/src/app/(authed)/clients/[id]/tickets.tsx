import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useBrandClientDetailedByIdQuery } from '@symbiot-core-apps/api';
import { EmptyView, InitView } from '@symbiot-core-apps/ui';
import { useEffect } from 'react';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const {
    data: client,
    error,
    isPending,
  } = useBrandClientDetailedByIdQuery(id, false);

  useEffect(() => {
    if (client) {
      navigation.setOptions({
        headerTitle: `${client.firstname} ${client.lastname}`,
      });
    }
  }, [client, navigation]);

  if (!client || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <EmptyView />;
};
