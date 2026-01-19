import { CurrentBrandTransactions } from '@symbiot-core-apps/brand-transaction';
import { useScreenHeaderHeight } from '@symbiot-core-apps/ui';

export default () => {
  const headerHeight = useScreenHeaderHeight();

  return <CurrentBrandTransactions offsetTop={headerHeight} />;
};
