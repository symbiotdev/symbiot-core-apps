import { CurrentBrandTransactions } from '@symbiot-core-apps/brand-transaction';
import { useHeaderHeight } from '@symbiot-core-apps/ui2';

export default () => {
  const headerHeight = useHeaderHeight();

  return <CurrentBrandTransactions offsetTop={headerHeight} />;
};
