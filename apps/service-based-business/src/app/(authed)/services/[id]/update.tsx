import { PageView } from '@symbiot-core-apps/ui';
import { useBrandServiceDetailedByIdQuery } from '@symbiot-core-apps/api';
import { useLocalSearchParams } from 'expo-router';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: service,
    isPending,
    error,
  } = useBrandServiceDetailedByIdQuery(id);

  return <PageView />;
};
