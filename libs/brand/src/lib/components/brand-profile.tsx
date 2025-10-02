import { Brand } from '@symbiot-core-apps/api';
import {
  Avatar,
  FormView,
  getNicknameFromUrl,
  H3,
  Link,
  ListItemGroup,
  PageView,
  RegularText,
  SocialIcon,
} from '@symbiot-core-apps/ui';
import React, { useCallback, useMemo } from 'react';
import { View, XStack } from 'tamagui';
import { DateHelper, emitHaptic } from '@symbiot-core-apps/shared';
import { openBrowserAsync } from 'expo-web-browser';
import { BrandLocationItem } from './items/brand-location-item';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

export const BrandProfile = ({ brand }: { brand: Brand }) => {
  const { me } = useCurrentAccountState();
  const { t } = useTranslation();

  const instagram = useMemo(() => brand.instagrams?.[0], [brand.instagrams]);

  const onInstagramPress = useCallback(() => {
    if (!instagram) return;

    emitHaptic();

    void openBrowserAsync(instagram);
  }, [instagram]);

  return (
    <PageView scrollable withHeaderHeight>
      <FormView gap="$5">
        <View alignItems="center" gap="$2">
          <Avatar
            color="$background1"
            name={brand.name}
            url={brand.avatarXsUrl}
            size={100}
          />

          <H3 textAlign="center">{brand.name}</H3>

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

        {!!brand.about && (
          <ListItemGroup paddingVertical="$4" title={t('brand.profile.about')}>
            <RegularText>{brand.about}</RegularText>
          </ListItemGroup>
        )}

        {!!brand.locations?.length && (
          <ListItemGroup
            paddingVertical="$4"
            gap="$3"
            title={t('brand.profile.locations')}
            disabled={!brand.locations}
          >
            {brand.locations.map((location) => (
              <BrandLocationItem
                key={location.id}
                location={location}
                brand={brand}
                onPress={() => router.push(`/locations/${location.id}/profile`)}
              />
            ))}
          </ListItemGroup>
        )}

        {!!brand.birthday && (
          <ListItemGroup
            paddingVertical="$4"
            title={t('brand.profile.birthday')}
          >
            <RegularText>
              {DateHelper.format(brand.birthday, me?.preferences?.dateFormat)}
            </RegularText>
          </ListItemGroup>
        )}
      </FormView>
    </PageView>
  );
};
