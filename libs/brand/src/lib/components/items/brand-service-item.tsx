import {
  DateHelper,
  emitHaptic,
  formatPrice,
  useI18n,
} from '@symbiot-core-apps/shared';
import { ViewProps, XStack } from 'tamagui';
import {
  Chip,
  ChipSize,
  ChipType,
  FormView,
  MediumText,
  RegularText,
} from '@symbiot-core-apps/ui';
import { BrandService } from '@symbiot-core-apps/api';
import { useAppSettings } from '@symbiot-core-apps/app';

export const BrandServiceItem = ({
  service,
  hidePricing,
  onPress,
  ...viewProps
}: ViewProps & {
  service: BrandService;
  hidePricing?: boolean;
}) => {
  const { functionality } = useAppSettings();
  const { t } = useI18n();

  return (
    <FormView
      opacity={service.hidden ? 0.5 : 1}
      {...viewProps}
      {...(onPress && {
        cursor: 'pointer',
        pressStyle: { opacity: 0.8 },
        onPress: (e) => {
          emitHaptic();
          onPress?.(e);
        },
      })}
    >
      {service.hidden && (
        <RegularText color="$error" fontSize={12}>
          {t('brand_service.unavailable')}
        </RegularText>
      )}

      <XStack flex={1}>
        <MediumText numberOfLines={2} flex={1}>
          {service.name}
        </MediumText>

        {!hidePricing && functionality.availability.servicePrice && (
          <XStack gap="$2" alignItems="center">
            {service.price ? (
              <>
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
              </>
            ) : (
              <RegularText>{t('brand_service.free')}</RegularText>
            )}
          </XStack>
        )}
      </XStack>

      <BrandServiceItemChips service={service} />
    </FormView>
  );
};

export const BrandServiceItemChips = ({
  service,
  type,
  size = 'small',
}: {
  service: BrandService;
  type?: ChipType;
  size?: ChipSize;
}) => (
  <XStack flex={1} flexWrap="wrap" gap="$1">
    {service.duration && (
      <Chip
        label={DateHelper.formatDuration(service.duration, {
          shortFormat: true,
        })}
        type={type}
        size={size}
      />
    )}

    {service.type?.value && (
      <Chip label={service.type.label} type={type} size={size} />
    )}
    {service.format?.value && (
      <Chip
        label={`${service.format.label}${!service.format.fixed ? ` (${service.places})` : ''}`}
        type={type}
        size={size}
      />
    )}
    {service.gender?.value && (
      <Chip label={service.gender.label} type={type} size={size} />
    )}
  </XStack>
);
