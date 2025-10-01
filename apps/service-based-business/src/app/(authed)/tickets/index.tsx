import { CurrentBrandTickets } from '@symbiot-core-apps/brand-ticket';
import { router } from 'expo-router';
import { useScreenHeaderHeight } from '@symbiot-core-apps/ui';

export default () => {
  const headerHeight = useScreenHeaderHeight();

  return (
    <CurrentBrandTickets
      offsetTop={headerHeight}
      onTicketPress={(ticket) => router.push(`/tickets/${ticket.id}/profile`)}
    />
  );
};
