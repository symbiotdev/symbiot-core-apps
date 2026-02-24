import { useLocalSearchParams, useNavigation } from 'expo-router';
import { BrandClientTransactions } from '@symbiot-core-apps/brand-transaction';
import { useEffect } from 'react';
import { useBrandClientDetailedByIdReq } from '@symbiot-core-apps/api';
import { FallbackView, useHeaderHeight } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const {
    data: client,
    error,
    isPending,
  } = useBrandClientDetailedByIdReq(id, false);

  useEffect(() => {
    if (client) {
      navigation.setOptions({
        headerTitle: `${client.firstname} ${client.lastname}`,
      });
    }
  }, [client, navigation]);

  if (!client || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <BrandClientTransactions clientId={id} offsetTop={headerHeight} />;
};
