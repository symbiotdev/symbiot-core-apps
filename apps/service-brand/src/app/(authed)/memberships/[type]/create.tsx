import { CreateBrandMembership } from '@symbiot-core-apps/brand-membership';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useLayoutEffect, useMemo } from 'react';
import { goBack, useI18n } from '@symbiot-core-apps/shared';
import {
  useAccountLimits,
  useAccountSubscription,
} from '@symbiot-core-apps/account-subscription';

export default () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const { type } = useLocalSearchParams<{ type: BrandMembershipType }>();
  const { canDo, getMembershipDetails } = useAccountLimits();
  const { showPaywall } = useAccountSubscription();

  const canCreate = useMemo(
    () => canDo[getMembershipDetails(type).limitAction],
    [canDo, getMembershipDetails, type],
  );

  useLayoutEffect(() => {
    if (!canCreate) {
      goBack();
      showPaywall();
    } else {
      navigation.setOptions({
        headerTitle: t(
          `${getTranslateKeyByBrandMembershipType(type)}.create.new`,
        ),
      });
    }
  }, [navigation, type, t, canCreate, showPaywall]);

  return canCreate && <CreateBrandMembership type={type} />;
};
