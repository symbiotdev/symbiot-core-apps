import { BrandTicket } from '@symbiot-core-apps/api';
import { FormView } from '@symbiot-core-apps/ui';

export const BrandTicketItem = ({
  ticket,
  navigateTo,
}: {
  ticket: BrandTicket;
  navigateTo?: 'update' | 'profile';
}) => {
  return <FormView></FormView>;
};
