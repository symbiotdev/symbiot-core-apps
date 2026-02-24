import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { PromoCodeTrigger } from './promo-code-trigger';
import { EmptyView } from '@symbiot-core-apps/ui2';

export const DevelopmentPaywall = ({
  onApplyPromoCode,
}: {
  onApplyPromoCode: () => void;
}) => {
  const { me } = useCurrentAccountState();

  return (
    <EmptyView
      style={{ minHeight: 300 }}
      iconName="Rocket2"
      title="Subscription Paywall"
      message={me?.offeredPrivileges?.join('.\n') || 'No benefits'}
    >
      <PromoCodeTrigger onPress={onApplyPromoCode} />
    </EmptyView>
  );
};
