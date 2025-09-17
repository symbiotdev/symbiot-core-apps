import { PageView } from '@symbiot-core-apps/ui';
import { useBrandServiceProfileByIdQuery } from '@symbiot-core-apps/api';
import { useLocalSearchParams } from 'expo-router';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: service,
    isPending,
    error,
  } = useBrandServiceProfileByIdQuery(id, false);

  return <PageView />;
};
