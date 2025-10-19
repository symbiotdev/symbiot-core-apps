import { DateHelper, emitHaptic, formatPrice } from '@symbiot-core-apps/shared';
import { ViewProps, XStack } from 'tamagui';
import { Chip, FormView, MediumText, RegularText } from '@symbiot-core-apps/ui';
import { BrandService } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { useApp } from '@symbiot-core-apps/app';

export const BrandServiceItem = ({
  service,
  hidePricing,
  onPress,
  ...viewProps
}: ViewProps & {
  service: BrandService;
  hidePricing?: boolean;
}) => {
  const { functionality } = useApp();
  const { t } = useTranslation();

  return (
    <FormView
      {...viewProps}
      gap="$3"
      opacity={service.hidden ? 0.7 : 1}
      cursor={onPress ? 'pointer' : undefined}
      pressStyle={onPress && { opacity: 0.8 }}
      onPress={(e) => {
        onPress && emitHaptic();
        onPress?.(e);
      }}
    >
      <XStack flex={1}>
        <MediumText numberOfLines={2} flex={1}>
          {service.name}
        </MediumText>

        {!hidePricing && functionality.availability.servicePrice && (
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

      <BrandServiceItemChips service={service} />
    </FormView>
  );
};

export const BrandServiceItemChips = ({
  service,
}: {
  service: BrandService;
}) => (
  <XStack flex={1} flexWrap="wrap" gap="$1">
    {service.duration && (
      <Chip
        label={DateHelper.formatDuration(service.duration, {
          shortFormat: true,
        })}
        size="small"
      />
    )}

    {service.type?.value && <Chip label={service.type.label} size="small" />}
    {service.format?.value && (
      <Chip label={service.format.label} size="small" />
    )}
    {service.gender?.value && (
      <Chip label={service.gender.label} size="small" />
    )}
  </XStack>
);
