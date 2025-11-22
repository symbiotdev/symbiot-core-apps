import { useCurrentBrandReq } from '@symbiot-core-apps/api';
import {
  Avatar,
  ButtonIcon,
  FormView,
  H3,
  InitView,
  ListItemGroup,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import React, { useEffect, useMemo } from 'react';
import { View, XStack } from 'tamagui';
import { DateHelper } from '@symbiot-core-apps/shared';
import { openBrowserAsync } from 'expo-web-browser';
import { BrandLocationItem } from './items/brand-location-item';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { BrandCongrats } from './brand-congrats';
import { BrandProfileCompletion } from './brand-profile-completion';

export const CurrentBrandProfile = () => {
  const { me } = useCurrentAccountState();
  const { brand: currentBrand, setBrand } = useCurrentBrandState();
  const { hasPermission } = useCurrentBrandEmployee();
  const { t } = useTranslation();
  const {
    data: currentBrandResponse,
    isPending,
    error,
  } = useCurrentBrandReq({
    enabled: true,
  });

  const brand = currentBrandResponse?.brand;
  const instagram = useMemo(() => brand?.instagrams?.[0], [brand?.instagrams]);
  const website = useMemo(() => brand?.websites?.[0], [brand?.websites]);

  useEffect(() => {
    if (brand) {
      setBrand(brand);
    }
  }, [brand, setBrand]);

  if (!currentBrand) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <PageView scrollable withHeaderHeight>
      <FormView gap="$5">
        <BrandCongrats brand={currentBrand} />

        <View alignItems="center" gap="$2">
          <Avatar
            color="$background1"
            name={currentBrand.name}
            url={currentBrand.avatar?.xsUrl}
            size={100}
          />

          <H3 textAlign="center">{currentBrand.name}</H3>

          {(!!instagram || !!website) && (
            <XStack justifyContent="center" gap="$2" marginTop="$2">
              {!!instagram && (
                <ButtonIcon
                  iconName="Instagram"
                  size={40}
                  iconSize={20}
                  onPress={() => openBrowserAsync(instagram)}
                />
              )}
              {!!website && (
                <ButtonIcon
                  iconName="Link"
                  size={40}
                  iconSize={20}
                  onPress={() => openBrowserAsync(website)}
                />
              )}
            </XStack>
          )}
        </View>

        {hasPermission('brand') && (
          <BrandProfileCompletion showAction brand={currentBrand} />
        )}

        {!!currentBrand.locations?.length && (
          <ListItemGroup
            paddingVertical="$4"
            gap="$3"
            title={t('brand.profile.locations')}
          >
            {currentBrand.locations.map((location) => (
              <BrandLocationItem
                key={location.id}
                location={location}
                brand={brand}
                onPress={() => router.push(`/locations/${location.id}/profile`)}
              />
            ))}
          </ListItemGroup>
        )}

        <ListItemGroup
          paddingVertical={0}
          paddingHorizontal="$3"
          backgroundColor="transparent"
          title={t('brand.profile.about')}
        >
          <RegularText lineHeight={20}>
            {currentBrand.about?.trim() || t('shared.not_specified')}
          </RegularText>
        </ListItemGroup>

        <ListItemGroup
          paddingVertical={0}
          paddingHorizontal="$3"
          backgroundColor="transparent"
          title={t('brand.profile.birthday')}
        >
          <RegularText>
            {currentBrand.birthday
              ? DateHelper.format(
                  currentBrand.birthday,
                  me?.preferences?.dateFormat,
                )
              : t('shared.not_specified')}
          </RegularText>
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
