import { MediumText, RegularText, SemiBoldText } from '@symbiot-core-apps/ui';
import { BrandTransaction } from '@symbiot-core-apps/api';
import { View, ViewProps, XStack } from 'tamagui';
import {
  DateHelper,
  emitHaptic,
  formatDiscount,
  formatPrice,
  ShowNativeSuccessAlert,
  useI18n,
} from '@symbiot-core-apps/shared';
import { useCallback } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { useCurrentAccountPreferences } from '@symbiot-core-apps/state';

export const BrandTransactionItem = ({
  transaction,
  onPress,
  ...viewProps
}: ViewProps & {
  transaction: BrandTransaction;
}) => {
  const { t } = useI18n();
  const preferences = useCurrentAccountPreferences();

  const copyId = useCallback(() => {
    emitHaptic();

    Clipboard.setString(transaction.id);

    ShowNativeSuccessAlert({
      title: t('shared.copied'),
    });
  }, [t, transaction.id]);

  return (
    <View
      maxWidth={400}
      width="100%"
      gap="$2"
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
      <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
        <RegularText>{t('brand_transaction.transaction_id')}</RegularText>
        <RegularText
          cursor="pointer"
          pressStyle={{ opacity: 0.8 }}
          onPress={copyId}
        >
          {transaction.hash}
        </RegularText>
      </XStack>

      <XStack
        justifyContent="space-between"
        gap="$5"
        flexWrap="wrap"
        marginTop="$2"
      >
        <RegularText>{t('brand_transaction.price')}</RegularText>
        <RegularText color={transaction.price > 0 ? '#4CAF50' : '#EF5350'}>
          {formatPrice({
            price: transaction.price,
            symbol: transaction.currency?.symbol,
          })}
        </RegularText>
      </XStack>

      {!!transaction.discount && (
        <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
          <RegularText>{t('brand_transaction.discount')}</RegularText>
          <RegularText>
            {formatDiscount({
              discount: transaction.discount,
              symbol: transaction.currency?.symbol,
            })}
          </RegularText>
        </XStack>
      )}

      {!!transaction.payer && (
        <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
          <RegularText>{t('brand_transaction.payer')}</RegularText>
          <RegularText>{transaction.payer}</RegularText>
        </XStack>
      )}

      <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
        <RegularText>{t(`brand_transaction.type`)}</RegularText>
        <RegularText>
          {t(`brand_transaction.by_type.${transaction.type}`)}
        </RegularText>
      </XStack>

      <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
        <RegularText>{t('brand_transaction.name')}</RegularText>
        <RegularText>{transaction.name}</RegularText>
      </XStack>

      <XStack justifyContent="space-between" gap="$5" flexWrap="wrap">
        <RegularText>{t('brand_transaction.date')}</RegularText>
        <RegularText>
          {DateHelper.format(
            transaction.cAt,
            `${preferences.dateFormat || 'P'} ${preferences.timeFormat}`,
          )}
        </RegularText>
      </XStack>

      <View
        height={1}
        width="100%"
        backgroundColor="$background"
        marginTop="$2"
      />

      <XStack
        justifyContent="space-between"
        gap="$5"
        marginTop="$2"
        flexWrap="wrap"
      >
        <MediumText>{t('brand_transaction.total')}</MediumText>
        <SemiBoldText fontSize={24}>
          {formatPrice({
            price: transaction.price,
            discount: transaction.discount,
            symbol: transaction.currency?.symbol,
          })}
        </SemiBoldText>
      </XStack>
    </View>
  );
};
