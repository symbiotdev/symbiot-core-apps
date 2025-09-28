import { BrandMembership } from '@symbiot-core-apps/api';
import { emitHaptic, formatPrice } from '@symbiot-core-apps/shared';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { View, XStack } from 'tamagui';
import { Chip, H3, RegularText } from '@symbiot-core-apps/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAllBrandLocation } from '../../hooks/use-additional-brand-location';

export const BrandMembershipItem = ({
  membership,
  navigateTo,
}: {
  membership: BrandMembership;
  navigateTo?: 'update' | 'profile';
}) => {
  const { t } = useTranslation();
  const allLocations = useAllBrandLocation();

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
      cursor="pointer"
      opacity={membership.hidden ? 0.7 : 1}
      pressStyle={{ opacity: 0.8 }}
      disabled={!navigateTo}
      onPress={() => {
        emitHaptic();
        router.push(`/memberships/${membership.id}/${navigateTo || 'profile'}`);
      }}
    >
      <LinearGradient
        colors={['#FFFFFF05', '#FFFFFF30', '#FFFFFF05']}
        start={{ x: 1, y: 1 }}
        end={{ x: -1, y: -1 }}
        style={StyleSheet.absoluteFill}
      />

      <XStack>
        {!!membership.validity && (
          <Chip label={membership.validity?.label} size="small" />
        )}
      </XStack>

      <View gap="$1">
        <H3 numberOfLines={2} color="white" zIndex={1}>
          {membership.name}
        </H3>
        {membership.location !== undefined && (
          <RegularText color="$placeholderColor">
            {membership.location?.name || allLocations.label}
          </RegularText>
        )}
      </View>

      {membership.price ? (
        <XStack gap="$2" alignItems="center" alignSelf="flex-end">
          <RegularText color="white">
            {formatPrice({
              price: membership.price,
              discount: membership.discount,
              symbol: membership.currency?.symbol,
            })}
          </RegularText>

          {!!membership.discount && (
            <RegularText
              textDecorationLine="line-through"
              color="$placeholderColor"
            >
              {formatPrice({
                price: membership.price,
                symbol: membership.currency?.symbol,
              })}
            </RegularText>
          )}
        </XStack>
      ) : (
        <View alignSelf="flex-end">
          <RegularText color="white">{t('brand_service.free')}</RegularText>
        </View>
      )}
    </View>
  );
};
