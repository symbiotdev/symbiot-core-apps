import { EmptyView } from '@symbiot-core-apps/ui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

export const DevelopmentPaywall = () => {
  const {me} = useCurrentAccountState()

  return (
    <EmptyView
      iconName="Rocket2"
      title="Subscription Paywall"
      message={me?.offeredPrivileges?.join('.\n') || 'No benefits'}
      minHeight={300}
    />
  );
};
