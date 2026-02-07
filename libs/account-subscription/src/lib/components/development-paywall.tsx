import { EmptyView } from '@symbiot-core-apps/ui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { PromoCodeTrigger } from './promo-code-trigger';

export const DevelopmentPaywall = ({
  onApplyPromoCode,
}: {
  onApplyPromoCode: () => void;
}) => {
  const { me } = useCurrentAccountState();

  return (
    <EmptyView
      iconName="Rocket2"
      title="Subscription Paywall"
      message={me?.offeredPrivileges?.join('.\n') || 'No benefits'}
      minHeight={300}
    >
      <PromoCodeTrigger onPress={onApplyPromoCode} />
    </EmptyView>
  );
};
