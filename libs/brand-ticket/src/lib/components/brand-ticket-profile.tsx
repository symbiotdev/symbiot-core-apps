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
  BrandTicketItem,
  useAllBrandLocation,
  useAnyBrandService,
} from '@symbiot-core-apps/brand';

export const BrandTicketProfile = ({ ticket }: { ticket: BrandTicket }) => {
  const { t } = useTranslation();
  const anyService = useAnyBrandService();
  const allLocations = useAllBrandLocation();
  const { brand } = useCurrentBrandState();

  return (
    <PageView scrollable withHeaderHeight>
      <BrandTicketItem
        alignSelf="center"
        navigateTo="profile"
        ticket={ticket}
      />

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
                navigateTo="profile"
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
                navigateTo="profile"
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
