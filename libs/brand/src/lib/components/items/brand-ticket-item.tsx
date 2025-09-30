import { BrandTicket } from '@symbiot-core-apps/api';
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
  const { t } = useTranslation();
  const allLocations = useAllBrandLocation();

  return (
    <View
      backgroundColor="$background"
      overflow="hidden"
      position="relative"
      borderRadius="$10"
      maxWidth={400}
      width="100%"
      pressStyle={{ opacity: 0.8 }}
      cursor="pointer"
      disabled={!navigateTo}
      onPress={() => {
        emitHaptic();
        router.push(`/tickets/${ticket.id}/${navigateTo || 'profile'}`);
      }}
      {...viewProps}
    >
      <CutDown right={-cutoutSize / 1.5} />
      <CutDown left={-cutoutSize / 1.5} />

      <View
        backgroundColor="$background1"
        width="100%"
        height={140}
        gap="$2"
        padding={defaultPageHorizontalPadding}
      >
        <View gap="$2" flex={1} alignItems="center" justifyContent="center">
          <H3 textAlign="center" numberOfLines={2}>
            {ticket.name}
          </H3>

          <RegularText
            color="$placeholderColor"
            textAlign="center"
            numberOfLines={2}
          >
            {ticket.locations?.map(({ name }) => name).join(', ') ||
              allLocations.label}
          </RegularText>
        </View>

        {ticket.price ? (
          <XStack gap="$2" justifyContent="center">
            <RegularText>
              {formatPrice({
                price: ticket.price,
                discount: ticket.discount,
                symbol: ticket.currency?.symbol,
              })}
            </RegularText>

            {!!ticket.discount && (
              <RegularText
                textDecorationLine="line-through"
                color="$placeholderColor"
              >
                {formatPrice({
                  price: ticket.price,
                  symbol: ticket.currency?.symbol,
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
            count: ticket.visits,
          })}
        </RegularText>
      </View>
    </View>
  );
};
