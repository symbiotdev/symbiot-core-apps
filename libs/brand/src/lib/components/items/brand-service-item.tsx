import { DateHelper, emitHaptic, formatPrice } from '@symbiot-core-apps/shared';
import { router } from 'expo-router';
import { ViewProps, XStack } from 'tamagui';
import { Chip, FormView, MediumText, RegularText } from '@symbiot-core-apps/ui';
import { BrandService } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';

export const BrandServiceItem = ({
  service,
  navigateTo,
  hidePricing,
  ...viewProps
}: ViewProps & {
  service: BrandService;
  navigateTo?: 'update' | 'profile';
  hidePricing?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <FormView
      {...viewProps}
      gap="$2"
      cursor="pointer"
      opacity={service.hidden ? 0.7 : 1}
      pressStyle={{ opacity: 0.8 }}
      onPress={() => {
        emitHaptic();
        router.push(`/services/${service.id}/${navigateTo || 'profile'}`);
      }}
    >
      <XStack flex={1}>
        <MediumText numberOfLines={2} flex={1}>
          {service.name}
        </MediumText>

        {!hidePricing && (
          <>
            {service.price ? (
              <XStack gap="$2" alignItems="center">
                <RegularText>
                  {formatPrice({
                    price: service.price,
                    discount: service.discount,
                    symbol: service.currency?.symbol,
                  })}
                </RegularText>

                {!!service.discount && (
                  <RegularText
                    textDecorationLine="line-through"
                    color="$placeholderColor"
                  >
                    {formatPrice({
                      price: service.price,
                      symbol: service.currency?.symbol,
                    })}
                  </RegularText>
                )}
              </XStack>
            ) : (
              <RegularText>{t('brand_service.free')}</RegularText>
            )}
          </>
        )}
      </XStack>

      <XStack flex={1} flexWrap="wrap" gap="$1">
        {service.duration && (
          <Chip
            label={DateHelper.formatDuration(service.duration, true)}
            size="small"
          />
        )}

        {service.type?.value && (
          <Chip label={service.type.label} size="small" />
        )}
        {service.format?.value && (
          <Chip label={service.format.label} size="small" />
        )}
        {service.gender?.value && (
          <Chip label={service.gender.label} size="small" />
        )}
      </XStack>
    </FormView>
  );
};
