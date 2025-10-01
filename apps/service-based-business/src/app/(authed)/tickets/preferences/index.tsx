import React, { useLayoutEffect } from 'react';
import { HeaderButton } from '@symbiot-core-apps/ui';
import { router, useNavigation } from 'expo-router';
import { CurrentBrandTickets } from '@symbiot-core-apps/brand-ticket';

export default () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          iconName="AddCircle"
          onPress={() => router.push('/tickets/create')}
        />
      ),
    });
  }, [navigation]);

  return (
    <CurrentBrandTickets
      onTicketPress={(ticket) => router.push(`/tickets/${ticket.id}/update`)}
    />
  );
};
