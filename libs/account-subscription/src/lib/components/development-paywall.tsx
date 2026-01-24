import { EmptyView } from '@symbiot-core-apps/ui';

export const DevelopmentPaywall = () => {
  return (
    <EmptyView
      iconName="Rocket2"
      title="Subscription Paywall"
      message="Now available in dev mode"
      minHeight={300}
    />
  );
};
