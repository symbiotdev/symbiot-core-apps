import {
  AnyBrandClientMembership,
  AnyBrandMembership,
  BrandClientPeriodBasedMembership,
  BrandClientVisitBasedMembership,
  BrandMembershipPeriod,
  BrandMembershipType,
  BrandPeriodBasedMembership,
  BrandVisitBasedMembership,
  Currency,
  getBrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import {
  DateHelper,
  emitHaptic,
  formatPrice,
  useI18n,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { View, ViewProps, XStack } from 'tamagui';
import {
  Chip,
  ExtraBoldText,
  H3,
  MediumText,
  RegularText,
} from '@symbiot-core-apps/ui';
import React, { useMemo } from 'react';
import { useAllBrandLocation } from '../../hooks/use-additional-brand-location';

export const BrandMembershipItem = ({
  membership,
  ...viewProps
}: ViewProps & {
  membership: AnyBrandMembership;
}) => {
  return getBrandMembershipType(membership) === BrandMembershipType.period ? (
    <BrandPeriodBasedMembershipItemView
      {...viewProps}
      name={membership.name}
      period={(membership as BrandPeriodBasedMembership).period}
      price={membership.price}
      discount={membership.discount}
      currency={membership.currency}
      hidden={membership.hidden}
      locations={membership.locations}
      opacity={membership.hidden ? 0.7 : 1}
      removed={!!membership.dAt}
    />
  ) : (
    <BrandVisitBasedMembershipItemView
      {...viewProps}
      name={membership.name}
      visits={(membership as BrandVisitBasedMembership).visits}
      price={membership.price}
      discount={membership.discount}
      currency={membership.currency}
      hidden={membership.hidden}
      locations={membership.locations}
      opacity={membership.hidden ? 0.7 : 1}
      removed={!!membership.dAt}
      endAt={membership.endAt}
    />
  );
};

export const BrandClientMembershipItem = ({
  membership,
  ...viewProps
}: ViewProps & {
  membership: AnyBrandClientMembership;
}) => {
  return getBrandMembershipType(membership) === BrandMembershipType.period ? (
    <BrandPeriodBasedMembershipItemView
      {...viewProps}
      key={membership.id}
      name={membership.name}
      period={(membership as BrandClientPeriodBasedMembership).period}
      price={membership.price}
      discount={membership.discount}
      currency={membership.currency}
      locations={membership.locations}
      endAt={membership.endAt}
      removed={!!membership.dAt}
    />
  ) : (
    <BrandVisitBasedMembershipItemView
      {...viewProps}
      key={membership.id}
      name={membership.name}
      visits={(membership as BrandClientVisitBasedMembership).visits}
      price={membership.price}
      discount={membership.discount}
      currency={membership.currency}
      locations={membership.locations}
      removed={!!membership.dAt}
      endAt={membership.endAt}
    />
  );
};

const BrandPeriodBasedMembershipItemView = ({
  name,
  locations,
  price,
  discount,
  hidden,
  currency,
  period,
  endAt,
  removed,
  onPress,
  ...viewProps
}: ViewProps & {
  name: string;
  price: number;
  discount: number;
  hidden?: boolean;
  currency: Currency;
  locations?: { id: string; name: string }[];
  endAt?: string;
  removed?: boolean;
  period: BrandMembershipPeriod;
}) => {
  const { t } = useI18n();
  const allLocations = useAllBrandLocation();
  const { now } = useNativeNow();

  return (
    <View
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
      opacity={hidden ? 0.5 : 1}
      disabledStyle={{ opacity: 0.5 }}
      {...viewProps}
      {...(onPress &&
        !viewProps.disabled && {
          cursor: 'pointer',
          pressStyle: { opacity: 0.8 },
          onPress: (e) => {
            emitHaptic();
            onPress?.(e);
          },
        })}
    >
      <LinearGradient
        colors={['#FFFFFF05', '#FFFFFF30', '#FFFFFF30', '#FFFFFF05']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: -1 }}
        style={StyleSheet.absoluteFill}
      />

      <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
        {!!period && <Chip label={period?.label} size="small" />}

        {!!removed && (
          <Chip label={t('shared.deleted')} size="small" type="danger" />
        )}

        {!removed && !!endAt && (
          <Chip
            label={
              DateHelper.isAfter(now, endAt)
                ? t(
                    `${getTranslateKeyByBrandMembershipType(BrandMembershipType.period)}.expired`,
                  )
                : t('shared.expires_in', {
                    value: DateHelper.formatDuration(
                      DateHelper.differenceInMinutes(endAt, now),
                      {
                        onlyHighestValue: true,
                        onlyDuration: ['days', 'hours', 'minutes'],
                      },
                    ),
                  })
            }
            size="small"
            type="danger"
          />
        )}
      </XStack>

      <View gap="$2">
        {!!hidden && (
          <MediumText color="$error">
            {t(
              `${getTranslateKeyByBrandMembershipType(BrandMembershipType.period)}.unavailable`,
            )}
          </MediumText>
        )}

        <H3 numberOfLines={2} color="white" zIndex={1}>
          {name}
        </H3>
        <RegularText color="$placeholderColor" numberOfLines={2}>
          {locations?.map(({ name }) => name)?.join(', ') || allLocations.label}
        </RegularText>
      </View>

      {price ? (
        <XStack gap="$2" alignItems="center" alignSelf="flex-end">
          {!!discount && (
            <MediumText
              textDecorationLine="line-through"
              color="$placeholderColor"
            >
              {formatPrice({
                price,
                symbol: currency?.symbol,
              })}
            </MediumText>
          )}

          <ExtraBoldText color="white" fontSize={24}>
            {formatPrice({
              price,
              discount,
              symbol: currency?.symbol,
            })}
          </ExtraBoldText>
        </XStack>
      ) : (
        <View alignSelf="flex-end">
          <RegularText color="white">{t('shared.free')}</RegularText>
        </View>
      )}
    </View>
  );
};

const BrandVisitBasedMembershipItemView = ({
  name,
  visits,
  price,
  discount,
  currency,
  hidden,
  locations,
  removed,
  endAt,
  onPress,
  ...viewProps
}: ViewProps & {
  name: string;
  visits: number;
  price: number;
  discount: number;
  hidden?: boolean;
  currency: Currency;
  locations?: { id: string; name: string }[];
  removed?: boolean;
  endAt?: string;
}) => {
  const { now } = useNativeNow();
  const { t } = useI18n();
  const allLocations = useAllBrandLocation();

  const expired = useMemo(
    () => endAt && DateHelper.isAfter(now, endAt),
    [endAt, now],
  );

  const info = useMemo(() => {
    if (expired) {
      return t(
        `${getTranslateKeyByBrandMembershipType(BrandMembershipType.visits)}.expired`,
      );
    } else if (visits <= 0) {
      return t(
        `${getTranslateKeyByBrandMembershipType(BrandMembershipType.visits)}.limit_reached`,
      );
    } else {
      return t(
        `${getTranslateKeyByBrandMembershipType(BrandMembershipType.visits)}.count_visits`,
        {
          count: visits,
        },
      );
    }
  }, [expired, t, visits]);

  return (
    <View
      padding="$4"
      overflow="hidden"
      position="relative"
      justifyContent="space-between"
      borderRadius="$10"
      height={200}
      maxWidth={400}
      width="100%"
      opacity={hidden ? 0.5 : 1}
      disabledStyle={{ opacity: 0.5 }}
      {...viewProps}
      {...(onPress &&
        !viewProps.disabled && {
          cursor: 'pointer',
          pressStyle: { opacity: 0.8 },
          onPress: (e) => {
            emitHaptic();
            onPress?.(e);
          },
        })}
    >
      <LinearGradient
        colors={['#5A3A2560', '#5A3A2599', '#5A3A2599', '#5A3A2560']}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: -1 }}
        style={StyleSheet.absoluteFill}
      />

      <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
        <Chip label={info} size="small" />

        {!removed && !expired && endAt && (
          <Chip
            alignSelf="center"
            label={t('shared.expires_in', {
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

        {!!removed && (
          <Chip label={t('shared.deleted')} type="danger" size="small" />
        )}
      </XStack>

      <View gap="$2">
        {!!hidden && (
          <MediumText color="$error">
            {t(
              `${getTranslateKeyByBrandMembershipType(BrandMembershipType.period)}.unavailable`,
            )}
          </MediumText>
        )}

        <H3 numberOfLines={2} color="white">
          {name}
        </H3>
        <RegularText color="$disabled" numberOfLines={2}>
          {locations?.map(({ name }) => name)?.join(', ') || allLocations.label}
        </RegularText>
      </View>

      {price ? (
        <XStack gap="$2" alignItems="center" alignSelf="flex-end">
          {!!discount && (
            <MediumText textDecorationLine="line-through" color="white">
              {formatPrice({
                price,
                symbol: currency?.symbol,
              })}
            </MediumText>
          )}

          <ExtraBoldText color="white" fontSize={24}>
            {formatPrice({
              price,
              discount,
              symbol: currency?.symbol,
            })}
          </ExtraBoldText>
        </XStack>
      ) : (
        <View alignSelf="flex-end">
          <RegularText color="white">{t('shared.free')}</RegularText>
        </View>
      )}
    </View>
  );
};
