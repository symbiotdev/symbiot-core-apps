import { CurrentBrandTickets } from '@symbiot-core-apps/brand-ticket';
import { router } from 'expo-router';

export default () => (
  <CurrentBrandTickets
    onTicketPress={(ticket) => router.push(`/tickets/${ticket.id}/profile`)}
  />
);
