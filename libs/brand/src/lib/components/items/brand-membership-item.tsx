import {
  AnyBrandMembership,
  BrandMembershipPeriod,
  Currency,
} from '@symbiot-core-apps/api';
import {
  DateHelper,
  emitHaptic,
  formatPrice,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { View, ViewProps, XStack } from 'tamagui';
import {
  Chip,
  defaultPageHorizontalPadding,
  H3,
  RegularText,
} from '@symbiot-core-apps/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAllBrandLocation } from '../../hooks/use-additional-brand-location';

const cutoutSize = 40;

const CutDown = (props: ViewProps) => (
  <View
    position="absolute"
    backgroundColor="$background"
    borderRadius={100}
    zIndex={1}
    top={120}
    width={cutoutSize}
    height={cutoutSize}
    {...props}
  />
);

export const BrandMembershipItem = ({
  membership,
  ...viewProps
}: ViewProps & {
  membership: AnyBrandMembership;
}) => {
  return 'period' in membership ? (
    <BrandPeriodBasedMembershipItemView
      {...viewProps}
      name={membership.name}
      period={membership.period}
      price={membership.price}
      discount={membership.discount}
      currency={membership.currency}
      locations={membership.locations?.map(({ name }) => name)}
      opacity={membership.hidden ? 0.7 : 1}
    />
  ) : (
    <BrandVisitBasedMembershipItemView
      {...viewProps}
      name={membership.name}
      visits={membership.visits}
      price={membership.price}
      discount={membership.discount}
      currency={membership.currency}
      locations={membership.locations?.map(({ name }) => name)}
      opacity={membership.hidden ? 0.7 : 1}
    />
  );
};

export const BrandPeriodBasedMembershipItemView = ({
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
      cursor={onPress ? 'pointer' : undefined}
      pressStyle={onPress && { opacity: 0.8 }}
      onPress={(e) => {
        onPress && emitHaptic();
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
                  onlyDuration: ['days', 'hours', 'minutes'],
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

export const BrandVisitBasedMembershipItemView = ({
  name,
  visits,
  price,
  discount,
  currency,
  locations,
  onPress,
  ...viewProps
}: ViewProps & {
  name: string;
  visits: number;
  price: number;
  discount: number;
  currency: Currency;
  locations?: string[];
}) => {
  const { t } = useTranslation();
  const allLocations = useAllBrandLocation();

  return (
    <View
      {...viewProps}
      backgroundColor="$background"
      overflow="hidden"
      position="relative"
      borderRadius="$10"
      maxWidth={400}
      width="100%"
      cursor={onPress ? 'pointer' : undefined}
      pressStyle={onPress && { opacity: 0.8 }}
      onPress={(e) => {
        onPress && emitHaptic();
        onPress?.(e);
      }}
    >
      <CutDown right={-cutoutSize / 1.5} />
      <CutDown left={-cutoutSize / 1.5} />

      <View
        backgroundColor="$background1"
        width="100%"
        minHeight={140}
        gap="$2"
        padding={defaultPageHorizontalPadding}
      >
        <View gap="$2" flex={1} alignItems="center" justifyContent="center">
          <H3 textAlign="center" numberOfLines={2}>
            {name}
          </H3>

          <RegularText
            color="$placeholderColor"
            textAlign="center"
            numberOfLines={2}
          >
            {locations?.join(', ') || allLocations.label}
          </RegularText>
        </View>

        {price ? (
          <XStack gap="$2" justifyContent="center">
            <RegularText>
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
          <RegularText textAlign="center">
            {t('brand_service.free')}
          </RegularText>
        )}
      </View>

      <View
        width="100%"
        borderWidth={2}
        borderStyle="dashed"
        borderColor="$background1"
      />

      <View
        backgroundColor="$background1"
        width="100%"
        justifyContent="center"
        alignItems="center"
        height={50}
      >
        <RegularText textAlign="center">
          {t('brand_ticket.count_visits', {
            count: visits,
          })}
        </RegularText>
      </View>
    </View>
  );
};
