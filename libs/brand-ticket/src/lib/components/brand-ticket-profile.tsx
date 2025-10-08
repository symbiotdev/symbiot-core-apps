import { BrandTicket } from '@symbiot-core-apps/api';
import {
  FormView,
  ListItemGroup,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import {
  BrandLocationItem,
  BrandServiceItem,
  BrandVisitBasedMembershipItem,
  useAllBrandLocation,
  useAnyBrandService,
} from '@symbiot-core-apps/brand';
import { router } from 'expo-router';

export const BrandTicketProfile = ({ ticket }: { ticket: BrandTicket }) => {
  const { brand } = useCurrentBrandState();
  const { t } = useTranslation();
  const anyService = useAnyBrandService();
  const allLocations = useAllBrandLocation();

  return (
    <PageView scrollable withHeaderHeight>
      <BrandVisitBasedMembershipItem alignSelf="center" membership={ticket} />

      <FormView gap="$5" marginVertical="$5">
        {!!ticket.description && (
          <ListItemGroup
            paddingVertical="$4"
            title={t('brand_ticket.profile.description')}
          >
            <RegularText>{ticket.description}</RegularText>
          </ListItemGroup>
        )}

        <ListItemGroup
          gap="$4"
          paddingVertical="$4"
          title={t('brand_ticket.profile.services')}
        >
          {ticket.services?.length ? (
            ticket.services.map((service, index) => (
              <BrandServiceItem
                borderTopWidth={!index ? 0 : 1}
                paddingTop={!index ? 0 : '$4'}
                borderTopColor="$background"
                hidePricing
                key={service.id}
                service={service}
                onPress={() => router.push(`/services/${service.id}/profile`)}
              />
            ))
          ) : (
            <RegularText>{anyService.label}</RegularText>
          )}
        </ListItemGroup>

        <ListItemGroup
          paddingVertical="$4"
          title={t('brand_ticket.profile.location')}
          disabled={!ticket.locations}
        >
          {ticket.locations?.length ? (
            ticket.locations.map((location) => (
              <BrandLocationItem
                key={location.id}
                location={location}
                brand={brand}
                onPress={() => router.push(`/locations/${location.id}/profile`)}
              />
            ))
          ) : (
            <RegularText>{allLocations.label}</RegularText>
          )}
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
