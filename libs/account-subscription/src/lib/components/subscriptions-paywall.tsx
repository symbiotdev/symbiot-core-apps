import {
  BoldText,
  Button,
  ExtraBoldText,
  CompactView,
  H2,
  Icon,
  MediumText,
  RegularText,
  SemiBoldText,
  Spinner,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import { PurchasesPackage } from 'react-native-purchases';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  openBrowserAsync,
  WebBrowserPresentationStyle,
} from 'expo-web-browser';
import { Platform } from 'react-native';
import Animated, {
  FadeInDown,
  LightSpeedInLeft,
  ZoomInEasyDown,
} from 'react-native-reanimated';
import { emitHaptic, useI18n } from '@symbiot-core-apps/shared';

export const SubscriptionsPaywall = ({
  offering,
  packages,
  subscribing,
  restoring,
  onSubscribe,
  onRestore,
}: {
  offering: string;
  packages: PurchasesPackage[];
  subscribing: boolean;
  restoring: boolean;
  onSubscribe: (pkg: PurchasesPackage) => void;
  onRestore: () => void;
}) => {
  const { t } = useI18n();
  const adjustedOffering = offering || 'default';
  const translatePrefix = `subscription.paywall.${adjustedOffering}`;
  const description = t(`${translatePrefix}.description.${Platform.OS}`);

  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage>(
    packages[0],
  );

  const { adjustedPackages, cheepestPackage, profit } = useMemo(() => {
    let adjustedPackages = packages
      .filter(
        ({ presentedOfferingContext }) =>
          presentedOfferingContext.offeringIdentifier === offering,
      )
      .sort(
        (pkgA, pkgB) =>
          Number(pkgA.product.pricePerWeek) - Number(pkgB.product.pricePerWeek),
      );

    if (!adjustedPackages.length) {
      adjustedPackages = packages;
    }

    const cheepestPackage = adjustedPackages[0];
    const mostExpensivePackage = adjustedPackages[adjustedPackages.length - 1];

    return {
      cheepestPackage,
      adjustedPackages,
      profit: Math.round(
        100 -
          (100 / Number(mostExpensivePackage.product.pricePerWeek)) *
            Number(cheepestPackage.product.pricePerWeek),
      ),
    };
  }, [offering, packages]);

  const openTermsConditions = useCallback(
    () =>
      openBrowserAsync(process.env.EXPO_PUBLIC_TERMS_CONDITIONS_URL, {
        presentationStyle: WebBrowserPresentationStyle.PAGE_SHEET,
      }),
    [],
  );

  const renderPackage = useCallback(
    (pkg: PurchasesPackage) => {
      const selected = selectedPackage.identifier === pkg.identifier;
      const backgroundColor = selected
        ? '$selectedSubscriptionBackgroundColor'
        : '$subscriptionBackgroundColor';
      const borderColor = selected
        ? '$selectedSubscriptionBorderColor'
        : '$subscriptionBorderColor';

      return (
        <Animated.View
          key={pkg.identifier}
          entering={ZoomInEasyDown.duration(500).delay(1000)}
          style={{ flex: 1, position: 'relative' }}
        >
          {pkg.identifier === cheepestPackage.identifier && (
            <View
              position="absolute"
              backgroundColor={borderColor}
              paddingVertical="$1"
              paddingHorizontal="$3"
              borderRadius="$10"
              alignSelf="center"
              borderColor={backgroundColor}
              borderWidth={1}
              top={-10}
              zIndex={1}
              disabled={subscribing || restoring}
              disabledStyle={{ opacity: 0.5 }}
              onPress={() => {
                emitHaptic();
                setSelectedPackage(pkg);
              }}
            >
              <MediumText fontSize={12} color={selected ? 'white' : undefined}>
                {t('subscription.discount', { value: profit })}
              </MediumText>
            </View>
          )}

          <View
            gap="$1"
            paddingVertical="$4"
            paddingHorizontal="$2"
            borderRadius="$10"
            position="relative"
            borderColor={borderColor}
            borderWidth={2}
            flex={1}
            disabled={subscribing || restoring}
            backgroundColor={backgroundColor}
            pressStyle={{ opacity: 0.8 }}
            disabledStyle={{ opacity: 0.5 }}
            onPress={() => {
              emitHaptic();
              setSelectedPackage(pkg);
            }}
          >
            <MediumText textAlign="center">
              {t(`subscription.type.${pkg.packageType.toLowerCase()}`)}
            </MediumText>

            <ExtraBoldText textAlign="center" fontSize={20}>
              {pkg.product.priceString}
            </ExtraBoldText>

            <MediumText
              textAlign="center"
              color="$placeholderColor"
              fontSize={12}
            >
              {pkg.product.pricePerWeekString}/{t('shared.datetime.unit.week')}
            </MediumText>
          </View>
        </Animated.View>
      );
    },
    [
      cheepestPackage.identifier,
      profit,
      restoring,
      selectedPackage.identifier,
      subscribing,
      t,
    ],
  );

  useLayoutEffect(() => {
    if (
      !packages.some(
        ({ identifier }) => identifier === selectedPackage?.identifier,
      )
    ) {
      setSelectedPackage(packages[0]);
    }
  }, [packages, selectedPackage?.identifier]);

  return (
    <CompactView flex={1}>
      <View gap="$3" marginTop="$5" alignItems="center">
        <Animated.View entering={LightSpeedInLeft.delay(100).duration(1000)}>
          <Icon name="Rocket2" type="SolarBold" size={60} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500)}
          style={{
            gap: 6,
          }}
        >
          <H2 textAlign="center">{t(`${translatePrefix}.title`)}</H2>
          <RegularText textAlign="center">
            {t(`${translatePrefix}.subtitle`)}
          </RegularText>
        </Animated.View>
      </View>

      <View gap="$2" marginTop="$5" marginBottom="$2">
        {(
          t(`${translatePrefix}.benefits`, { returnObjects: true }) as {
            title: string;
            subtitle: string;
          }[]
        ).map(({ title, subtitle }, index) => (
          <Animated.View
            key={index}
            style={{ flexDirection: 'row', gap: 6 }}
            entering={FadeInDown.delay(600 + index * 100)}
          >
            <Icon name="Unread" />

            <View gap="$1">
              <SemiBoldText lineHeight={24}>{title}</SemiBoldText>
              {/*<RegularText color="$disabled" fontSize={12}>*/}
              {/*  {subtitle}*/}
              {/*</RegularText>*/}
            </View>
          </Animated.View>
        ))}
      </View>

      <XStack marginTop="$4" gap="$2">
        {adjustedPackages.map(renderPackage)}
      </XStack>

      <Button
        label={t(`${translatePrefix}.action.subscribe`)}
        loading={subscribing}
        disabled={subscribing || restoring}
        onPress={() => onSubscribe(selectedPackage)}
      />

      <View gap="$2" marginTop="$2">
        <XStack
          gap="$2"
          justifyContent="center"
          flexWrap="wrap"
          alignItems="center"
        >
          {!restoring ? (
            <>
              <Button
                type="clear"
                width="auto"
                minHeight="auto"
                fontSize={12}
                paddingHorizontal={0}
                paddingVertical={0}
                label={t(`${translatePrefix}.action.restore`)}
                disabled={subscribing}
                onPress={onRestore}
              />
              <BoldText>{' · '}</BoldText>
              <Button
                type="clear"
                width="auto"
                minHeight="auto"
                fontSize={12}
                paddingHorizontal={0}
                paddingVertical={0}
                label={t(`${translatePrefix}.action.terms_privacy`)}
                disabled={subscribing}
                onPress={openTermsConditions}
              />
            </>
          ) : (
            <Spinner />
          )}
        </XStack>

        {!!description && (
          <RegularText fontSize={10} marginTop="$2" color="$disabled">
            {description}
          </RegularText>
        )}
      </View>
    </CompactView>
  );
};
