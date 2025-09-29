import { InitView } from '@symbiot-core-apps/ui';
import { useBrandTicketProfileByIdQuery } from '@symbiot-core-apps/api';
import { useLocalSearchParams } from 'expo-router';
import { RemoveBrandTicket } from '@symbiot-core-apps/brand-ticket';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: ticket,
    isPending,
    error,
  } = useBrandTicketProfileByIdQuery(id, false);

  if (!ticket || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <RemoveBrandTicket ticket={ticket} />;
};
