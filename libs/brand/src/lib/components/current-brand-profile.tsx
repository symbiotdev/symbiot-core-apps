import { useCurrentBrandReq } from '@symbiot-core-apps/api';
import {
  Avatar,
  FormView,
  getNicknameFromUrl,
  H3,
  InitView,
  Link,
  ListItemGroup,
  PageView,
  RegularText,
  SocialIcon,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useEffect, useMemo } from 'react';
import { View, XStack } from 'tamagui';
import { DateHelper, emitHaptic } from '@symbiot-core-apps/shared';
import { openBrowserAsync } from 'expo-web-browser';
import { BrandLocationItem } from './items/brand-location-item';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { BrandFoundationBirthday } from './brand-foundation-birthday';
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

  const onInstagramPress = useCallback(() => {
    if (!instagram) return;

    emitHaptic();

    void openBrowserAsync(instagram);
  }, [instagram]);

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
        <BrandFoundationBirthday />

        {hasPermission('brand') && (
          <BrandProfileCompletion showAction brand={currentBrand} />
        )}

        <View alignItems="center" gap="$2">
          <Avatar
            color="$background1"
            name={currentBrand.name}
            url={currentBrand.avatar?.xsUrl}
            size={100}
          />

          <H3 textAlign="center">{currentBrand.name}</H3>

          {!!instagram && (
            <XStack justifyContent="center" gap="$2" flex={1} maxWidth="80%">
              <SocialIcon name="Instagram" size={18} color="$link" />
              <Link
                onPress={onInstagramPress}
                lineHeight={18}
                numberOfLines={1}
              >
                {getNicknameFromUrl(instagram)}
              </Link>
            </XStack>
          )}
        </View>

        {!!currentBrand.about && (
          <ListItemGroup paddingVertical="$4" title={t('brand.profile.about')}>
            <RegularText>{currentBrand.about}</RegularText>
          </ListItemGroup>
        )}

        {!!currentBrand.locations?.length && (
          <ListItemGroup
            paddingVertical="$4"
            gap="$3"
            title={t('brand.profile.locations')}
            disabled={!currentBrand.locations}
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

        {!!currentBrand.birthday && (
          <ListItemGroup
            paddingVertical="$4"
            title={t('brand.profile.birthday')}
          >
            <RegularText>
              {DateHelper.format(
                currentBrand.birthday,
                me?.preferences?.dateFormat,
              )}
            </RegularText>
          </ListItemGroup>
        )}
      </FormView>
    </PageView>
  );
};
