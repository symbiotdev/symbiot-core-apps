import { HeaderButton, InitView } from '@symbiot-core-apps/ui';
import { useBrandTicketProfileByIdQuery } from '@symbiot-core-apps/api';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { XStack } from 'tamagui';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { BrandTicketProfile } from '@symbiot-core-apps/brand-ticket';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: ticket, isPending, error } = useBrandTicketProfileByIdQuery(id);
  const { hasPermission } = useCurrentBrandEmployee();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <XStack gap="$3">
          {hasPermission('analyticsAll') && (
            <HeaderButton
              iconName="ChartSquare"
              onPress={() => router.push(`/tickets/${id}/analytics`)}
            />
          )}
          {hasPermission('ticketsAll') && (
            <HeaderButton
              iconName="SettingsMinimalistic"
              onPress={() => router.push(`/tickets/${id}/update`)}
            />
          )}
        </XStack>
      ),
    });
  }, [hasPermission, id, navigation]);

  if (!ticket || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <BrandTicketProfile ticket={ticket} />;
};
