import {
  BrandMembership,
  BrandMembershipPeriod,
  Currency,
} from '@symbiot-core-apps/api';
import {
  DateHelper,
  emitHaptic,
  formatPrice,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { View, ViewProps, XStack } from 'tamagui';
import { Chip, H3, RegularText } from '@symbiot-core-apps/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAllBrandLocation } from '../../hooks/use-additional-brand-location';

export const BrandMembershipItem = ({
  membership,
  navigateTo,
  ...viewProps
}: ViewProps & {
  membership: BrandMembership;
  navigateTo?: 'update' | 'profile';
}) => {
  return (
    <BrandMembershipItemView
      {...viewProps}
      name={membership.name}
      period={membership.period}
      price={membership.price}
      discount={membership.discount}
      currency={membership.currency}
      locations={membership.locations?.map(({ name }) => name)}
      opacity={membership.hidden ? 0.7 : 1}
      disabled={!navigateTo}
      onPress={() => {
        router.push(`/memberships/${membership.id}/${navigateTo || 'profile'}`);
      }}
    />
  );
};

export const BrandMembershipItemView = ({
  name,
  locations,
  price,
  discount,
  currency,
  period,
  endAt,
  onPress,
  ...viewProps
}: ViewProps & {
  name: string;
  price: number;
  discount: number;
  currency: Currency;
  locations?: string[];
  endAt?: string;
  period: BrandMembershipPeriod;
}) => {
  const { t } = useTranslation();
  const allLocations = useAllBrandLocation();
  const { now } = useNativeNow();

  return (
    <View
      {...viewProps}
      height={200}
      maxWidth={400}
      width="100%"
      marginHorizontal="auto"
      backgroundColor="#051529"
      borderRadius="$10"
      overflow="hidden"
      padding="$4"
      gap="$2"
      justifyContent="space-between"
      position="relative"
      cursor="pointer"
      pressStyle={onPress && { opacity: 0.8 }}
      onPress={(e) => {
        emitHaptic();
        onPress?.(e);
      }}
    >
      <LinearGradient
        colors={['#FFFFFF05', '#FFFFFF30', '#FFFFFF05']}
        start={{ x: 1, y: 1 }}
        end={{ x: -1, y: -1 }}
        style={StyleSheet.absoluteFill}
      />

      <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
        {!!period && <Chip label={period?.label} size="small" />}
        {!!endAt && (
          <Chip
            label={t('brand_membership.expires_in', {
              value: DateHelper.formatDuration(
                DateHelper.differenceInMinutes(endAt, now),
                {
                  onlyHighestValue: true,
                },
              ),
            })}
            size="small"
            type="danger"
          />
        )}
      </XStack>

      <View gap="$1">
        <H3 numberOfLines={2} color="white" zIndex={1}>
          {name}
        </H3>
        <RegularText color="$placeholderColor">
          {locations?.join(', ') || allLocations.label}
        </RegularText>
      </View>

      {price ? (
        <XStack gap="$2" alignItems="center" alignSelf="flex-end">
          <RegularText color="white">
            {formatPrice({
              price,
              discount,
              symbol: currency?.symbol,
            })}
          </RegularText>

          {!!discount && (
            <RegularText
              textDecorationLine="line-through"
              color="$placeholderColor"
            >
              {formatPrice({
                price,
                symbol: currency?.symbol,
              })}
            </RegularText>
          )}
        </XStack>
      ) : (
        <View alignSelf="flex-end">
          <RegularText color="white">{t('brand_membership.free')}</RegularText>
        </View>
      )}
    </View>
  );
};
