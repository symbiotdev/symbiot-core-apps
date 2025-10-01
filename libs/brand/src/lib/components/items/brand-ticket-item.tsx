import { BrandTicket, Currency } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useAllBrandLocation } from '../../hooks/use-additional-brand-location';
import { View, ViewProps, XStack } from 'tamagui';
import {
  defaultPageHorizontalPadding,
  H3,
  RegularText,
} from '@symbiot-core-apps/ui';
import { emitHaptic, formatPrice } from '@symbiot-core-apps/shared';
import { router } from 'expo-router';

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

export const BrandTicketItem = ({
  ticket,
  navigateTo,
  ...viewProps
}: ViewProps & {
  ticket: BrandTicket;
  navigateTo?: 'update' | 'profile';
}) => {
  return (
    <BrandTicketItemView
      {...viewProps}
      name={ticket.name}
      visits={ticket.visits}
      price={ticket.price}
      discount={ticket.discount}
      currency={ticket.currency}
      locations={ticket.locations?.map(({ name }) => name)}
      opacity={ticket.hidden ? 0.7 : 1}
      disabled={!navigateTo}
      onPress={() =>
        router.push(`/tickets/${ticket.id}/${navigateTo || 'profile'}`)
      }
    />
  );
};

export const BrandTicketItemView = ({
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
      pressStyle={onPress && { opacity: 0.8 }}
      cursor="pointer"
      onPress={(e) => {
        emitHaptic();
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
