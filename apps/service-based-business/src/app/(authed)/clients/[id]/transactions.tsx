import { useScreenHeaderHeight } from '@symbiot-core-apps/ui';
import { useLocalSearchParams } from 'expo-router';
import { BrandClientTransactions } from '@symbiot-core-apps/brand-transaction';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const headerHeight = useScreenHeaderHeight();

  return <BrandClientTransactions clientId={id} offsetTop={headerHeight} />;
};
