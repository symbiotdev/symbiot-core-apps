import { BrandTicket } from '@symbiot-core-apps/api';
import { PageView } from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import {
  useAllBrandLocation,
  useAnyBrandService,
} from '@symbiot-core-apps/brand';

export const BrandTicketProfile = ({ ticket }: { ticket: BrandTicket }) => {
  const { t } = useTranslation();
  const anyService = useAnyBrandService();
  const allLocations = useAllBrandLocation();
  const { brand } = useCurrentBrandState();

  return <PageView scrollable withHeaderHeight></PageView>;
};
