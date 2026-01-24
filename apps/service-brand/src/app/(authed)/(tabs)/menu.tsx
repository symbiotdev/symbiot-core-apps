import {
  ConfirmAlert,
  DateHelper,
  DeviceVersion,
  emitHaptic,
  ShowNativeSuccessAlert,
  useI18n,
  useShareApp,
} from '@symbiot-core-apps/shared';
import {
  useCurrentAccountState,
  useCurrentBrandState,
  useScheme,
} from '@symbiot-core-apps/state';
import React, { useCallback, useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import {
  ActionCard,
  Avatar,
  FormView,
  H3,
  HeaderButton,
  Icon,
  ListItem,
  ListItemGroup,
  MediumText,
  QrCodeModalWithTrigger,
  RegularText,
  SemiBoldText,
  Spinner,
  TabsPageView,
  useDrawer,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import { GestureResponderEvent, Linking, Platform } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  AccountSubscriptionEnvironment,
  useAccountAuthSignOutReq,
} from '@symbiot-core-apps/api';
import { Image } from 'expo-image';
import { useAccountSubscription } from '@symbiot-core-apps/account-subscription';

export default () => {
  const { t, supportedLanguages } = useI18n();
  const { me } = useCurrentAccountState();
  const { brand } = useCurrentBrandState();
  const { scheme } = useScheme();
  const { visible: drawerVisible } = useDrawer();
  const share = useShareApp();
  const {
    processing: subscriptionProcessing,
    canSubscribe,
    isSubscriptionsAvailable,
    showPaywall,
    manageSubscriptions,
  } = useAccountSubscription();
  const { mutate: signOut } = useAccountAuthSignOutReq();
  const navigation = useNavigation();

  const onAccountPress = useCallback(() => {
    emitHaptic();
    router.push('/account/update');
  }, []);
  const onAppearancePress = useCallback(
    () => router.push('/appearance/preferences'),
    [],
  );
  const onCalendarPress = useCallback(
    () => router.push('/calendar/preferences'),
    [],
  );
  const onLanguagePress = useCallback(
    () => router.push('/language/preferences'),
    [],
  );
  const onNotificationsPress = useCallback(
    () => router.push('/notifications/preferences'),
    [],
  );
  const onTermsPrivacyPress = useCallback(
    () => router.push('/app/terms-privacy'),
    [],
  );
  const onFollowUsPress = useCallback(() => router.push('/app/follow-us'), []);
  const onHelpFeedbackPress = useCallback(
    () => router.push('/app/help-feedback'),
    [],
  );

  const copyId = useCallback(
    (e: GestureResponderEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!me?.id) return;

      emitHaptic();

      Clipboard.setString(me?.id);

      ShowNativeSuccessAlert({
        title: t('shared.copied'),
      });
    },
    [t, me?.id],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Image
          source={
            scheme === 'light'
              ? require('../../../../assets/images/icon/logo-light.png')
              : require('../../../../assets/images/icon/logo-dark.png')
          }
          style={{
            resizeMode: 'contain',
            height: 24,
            width: 100,
          }}
        />
      ),
      headerRight: () => (
        <HeaderButton
          iconName="Logout2"
          onPress={() =>
            ConfirmAlert({
              title: t('shared.auth.sign_out.confirm.title'),
              onAgree: signOut,
            })
          }
        />
      ),
    });
  }, [navigation, signOut, t, scheme]);

  return (
    me && (
      <TabsPageView scrollable withHeaderHeight>
        <FormView gap="$3" flex={1}>
          {canSubscribe && (
            <ActionCard
              title={t('subscription.card.title')}
              subtitle={t('subscription.card.subtitle')}
              buttonLabel={t('subscription.card.button.label')}
              buttonIcon={<Icon name="Rocket" />}
              onPress={showPaywall}
            />
          )}

          <ListItemGroup
            flexDirection="row"
            alignItems="center"
            cursor="pointer"
            paddingVertical="$4"
            pressStyle={{ opacity: 0.8 }}
            gap="$4"
            title={t('shared.my_profile')}
            onPress={onAccountPress}
          >
            <XStack alignItems="center" gap="$4" flex={1}>
              <Avatar
                url={me.avatar?.xsUrl}
                name={me.name}
                color={me.avatarColor}
                size={50}
              />
              <View flex={1} gap="$2">
                <H3 numberOfLines={1}>{me.name}</H3>

                <MediumText
                  alignSelf="flex-start"
                  color="$placeholderColor"
                  numberOfLines={1}
                  onPress={copyId}
                >
                  ID: {me.id}
                </MediumText>
              </View>
            </XStack>

            <QrCodeModalWithTrigger
              trigger={<Icon name="QrCode" />}
              qrValue={me.id}
              qrContent={<RegularText fontSize={30}>🤩</RegularText>}
            />
          </ListItemGroup>

          <ListItemGroup title={t('shared.preferences.title')}>
            <ListItem
              label={t('shared.preferences.notifications.title')}
              icon={<Icon name="Bell" />}
              onPress={onNotificationsPress}
            />
            <ListItem
              label={t('shared.preferences.appearance.title')}
              icon={<Icon name="Pallete2" />}
              onPress={onAppearancePress}
            />

            {supportedLanguages?.length > 1 && (
              <ListItem
                label={t('shared.preferences.language.title')}
                icon={<Icon name="Global" />}
                onPress={onLanguagePress}
              />
            )}

            <ListItem
              label={t('shared.calendar')}
              icon={<Icon name="Calendar" />}
              onPress={onCalendarPress}
            />
          </ListItemGroup>

          <ListItemGroup title={t('shared.application')}>
            {isSubscriptionsAvailable && brand?.subscription?.active && (
              <ListItem
                disabled={subscriptionProcessing}
                label={t('shared.preferences.subscriptions.title')}
                icon={<Icon name="Rocket2" />}
                iconAfter={subscriptionProcessing ? <Spinner /> : undefined}
                color={brand.subscription.canceled ? '$error' : undefined}
                text={`${brand.subscription.environment === AccountSubscriptionEnvironment.sandbox ? '[Sandbox] ' : ''}${
                  brand.subscription.canceled && brand.subscription.expiresDate
                    ? t('shared.preferences.subscriptions.expires_on', {
                        date: DateHelper.format(
                          brand.subscription.expiresDate,
                          me.preferences.dateFormat,
                        ),
                      })
                    : ''
                }`}
                onPress={manageSubscriptions}
              />
            )}
            {Platform.OS !== 'web' && (
              <ListItem
                label={t('shared.preferences.system.title')}
                icon={<Icon name="TuningSquare" />}
                onPress={Linking.openSettings}
              />
            )}
            <ListItem
              label={t('shared.share_app')}
              icon={<Icon name="Share" />}
              onPress={share}
            />
            {!drawerVisible && (
              <ListItem
                label={t('shared.faq.title')}
                icon={<Icon name="QuestionCircle" />}
                onPress={onHelpFeedbackPress}
              />
            )}
            <ListItem
              label={t('shared.docs.terms_privacy')}
              icon={<Icon name="FileText" />}
              onPress={onTermsPrivacyPress}
            />
            <ListItem
              label={t('shared.follow_us')}
              icon={<Icon name="ShareCircle" />}
              onPress={onFollowUsPress}
            />
          </ListItemGroup>

          <View alignItems="center" gap="$1" marginTop="auto">
            <Icon name="CodeCircle" color="$placeholderColor" />

            {Platform.OS !== 'web' && (
              <SemiBoldText>
                {t('shared.version')}: {DeviceVersion}
              </SemiBoldText>
            )}

            <RegularText color="$placeholderColor" textAlign="center">
              Powered by Symbiot
            </RegularText>
          </View>
        </FormView>
      </TabsPageView>
    )
  );
};
