import {
  BrandMembership,
  getTranslateKeyByBrandMembership,
} from '@symbiot-core-apps/api';
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
  useAllBrandLocation,
  useAnyBrandService,
} from '@symbiot-core-apps/brand';
import { router } from 'expo-router';
import { ReactElement } from 'react';

export const BrandMembershipProfile = ({
  membership,
  Item,
}: {
  membership: BrandMembership;
  Item: ReactElement;
}) => {
  const { t } = useTranslation();
  const anyService = useAnyBrandService();
  const allLocations = useAllBrandLocation();
  const tPrefix = getTranslateKeyByBrandMembership(membership);
  const { brand } = useCurrentBrandState();

  return (
    <PageView scrollable withHeaderHeight>
      {Item}

      <FormView gap="$5" marginVertical="$5">
        {!!membership.description && (
          <ListItemGroup
            paddingVertical="$4"
            title={t(`${tPrefix}.profile.description`)}
          >
            <RegularText>{membership.description}</RegularText>
          </ListItemGroup>
        )}

        <ListItemGroup
          gap="$1"
          paddingVertical={0}
          paddingHorizontal={0}
          backgroundColor="transparent"
          title={t(`${tPrefix}.profile.services`)}
        >
          {membership.services?.length ? (
            membership.services.map((service) => (
              <BrandServiceItem
                hidePricing
                backgroundColor="$background1"
                borderRadius="$10"
                padding="$4"
                key={service.id}
                service={service}
              />
            ))
          ) : (
            <RegularText>{anyService.label}</RegularText>
          )}
        </ListItemGroup>

        <ListItemGroup
          paddingVertical="$4"
          title={t(`${tPrefix}.profile.location`)}
          disabled={!membership.locations}
        >
          {membership.locations?.length ? (
            membership.locations.map((location) => (
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

        <ListItemGroup
          title={t(`${tPrefix}.profile.note`)}
          paddingVertical={0}
          backgroundColor="transparent"
        >
          <RegularText lineHeight={22}>
            {membership.note || t('shared.not_specified')}
          </RegularText>
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
