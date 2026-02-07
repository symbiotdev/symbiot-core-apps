import {
  DateHelper,
  DeviceVersion,
  emitHaptic,
  isTablet,
  ShowNativeSuccessAlert,
  useI18n,
  useRateApp,
  useShareApp,
} from '@symbiot-core-apps/shared';
import {
  useCurrentAccountState,
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import React, { useCallback } from 'react';
import { router } from 'expo-router';
import {
  ActionCard,
  Avatar,
  CompactView,
  H3,
  Icon,
  ListItem,
  ListItemGroup,
  MediumText,
  QrCodeModalWithTrigger,
  RegularText,
  Spinner,
  TabsPageView,
  useDrawer,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import { GestureResponderEvent, Linking, Platform } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { AccountSubscriptionEnvironment } from '@symbiot-core-apps/api';
import { useAccountSubscription } from '@symbiot-core-apps/account-subscription';
import { SymbiotLogo } from '../../../components/symbiot/logo/symbiot-logo';
import { useAppSettings } from '@symbiot-core-apps/app';

export default () => {
  const { t, supportedLanguages } = useI18n();
  const { me } = useCurrentAccountState();
  const { brand } = useCurrentBrandState();
  const { currentEmployee } = useCurrentBrandEmployee();
  const { functionality } = useAppSettings();
  const { visible: drawerVisible } = useDrawer();
  const share = useShareApp();
  const { leaveReview } = useRateApp();
  const {
    processing: subscriptionProcessing,
    canSubscribe,
    isSubscriptionsAvailable,
    showPaywall,
    manageSubscriptions,
  } = useAccountSubscription();

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

  return (
    me && (
      <TabsPageView
        scrollable
        withHeaderHeight={Platform.OS === 'web' || isTablet}
      >
        <CompactView gap="$3" flex={1}>
          {canSubscribe && (
            <ActionCard
              title={t('subscription.card.title')}
              subtitle={t('subscription.card.subtitle')}
              buttonLabel={t('subscription.card.button.label')}
              buttonIcon={<Icon name="Rocket" />}
              onPress={showPaywall}
            />
          )}

          {!currentEmployee ? (
            <ListItemGroup
              flexDirection="row"
              alignItems="center"
              cursor="pointer"
              paddingVertical="$4"
              pressStyle={{ opacity: 0.8 }}
              gap="$4"
              title={t('shared.id_card')}
              onPress={() => {
                emitHaptic();
                router.push('/account/update');
              }}
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
          ) : (
            <ListItemGroup
              flexDirection="row"
              alignItems="center"
              cursor="pointer"
              paddingVertical="$4"
              pressStyle={{ opacity: 0.8 }}
              gap="$4"
              title={t('shared.my_profile')}
              onPress={() => {
                emitHaptic();
                router.push(`/employees/me`);
              }}
            >
              <XStack alignItems="center" gap="$4" flex={1}>
                <Avatar
                  url={currentEmployee.avatar?.xsUrl}
                  name={currentEmployee.name}
                  color={currentEmployee.avatarColor}
                  size={50}
                />
                <View flex={1} gap="$2">
                  <H3 numberOfLines={1}>{currentEmployee.name}</H3>

                  <MediumText
                    alignSelf="flex-start"
                    color="$placeholderColor"
                    numberOfLines={1}
                  >
                    {currentEmployee.role}
                  </MediumText>
                </View>
              </XStack>
            </ListItemGroup>
          )}

          <ListItemGroup title={t('shared.preferences.title')}>
            <ListItem
              label={t('shared.preferences.notifications.title')}
              icon={<Icon name="Bell" />}
              onPress={() => router.push('/preferences/notifications')}
            />

            <ListItem
              label={t('shared.preferences.scheme.title')}
              icon={<Icon name="Pallete2" />}
              onPress={() => router.push('/preferences/scheme')}
            />

            {supportedLanguages?.length > 1 && (
              <ListItem
                label={t('shared.preferences.language.title')}
                icon={<Icon name="Global" />}
                onPress={() => router.push('/preferences/language')}
              />
            )}

            <ListItem
              label={t('shared.preferences.datetime.title')}
              icon={<Icon name="ClockCircle" />}
              onPress={() => router.push('/preferences/datetime')}
            />

            {!!currentEmployee && (
              <ListItem
                label={t('shared.preferences.calendar.title')}
                icon={<Icon name="Calendar" />}
                onPress={() => router.push('/preferences/calendar')}
              />
            )}
            {Platform.OS !== 'web' && (
              <ListItem
                label={t('shared.preferences.system.title')}
                icon={<Icon name="TuningSquare" />}
                onPress={Linking.openSettings}
              />
            )}
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
            {functionality.available.partnerProgram && Boolean(me.partner) && (
              <ListItem
                label={t('shared.partner_program.title')}
                icon={<Icon name="CrownLine" />}
                onPress={() => router.push('/app/partner-panel')}
              />
            )}
            <ListItem
              label={t('shared.share_app')}
              icon={<Icon name="Share" />}
              onPress={share}
            />
            {functionality.available.leaveReview && (
              <ListItem
                label={t('shared.rate_app.write_review')}
                icon={<Icon name="ChatRoundLike" />}
                onPress={leaveReview}
              />
            )}
            {!drawerVisible && (
              <ListItem
                label={t('shared.faq.title')}
                icon={<Icon name="QuestionCircle" />}
                onPress={() => router.push('/app/help-feedback')}
              />
            )}
            <ListItem
              label={t('shared.docs.terms_privacy')}
              icon={<Icon name="FileText" />}
              onPress={() => router.push('/app/terms-privacy')}
            />
            {functionality.available.reportIssue && (
              <ListItem
                label={t('shared.report_issue.title')}
                icon={<Icon name="Bug" />}
                onPress={() => router.push('/app/report-issue')}
              />
            )}
            <ListItem
              label={t('shared.follow_us')}
              icon={<Icon name="ShareCircle" />}
              onPress={() => router.push('/app/follow-us')}
            />
          </ListItemGroup>

          <View alignItems="center" marginTop="auto">
            <SymbiotLogo />

            <MediumText textAlign="center">Powered by Symbiot</MediumText>

            {Platform.OS !== 'web' && (
              <RegularText
                marginTop="$1"
                color="$placeholderColor"
                textAlign="center"
              >
                {t('shared.version')}: {DeviceVersion}
              </RegularText>
            )}
          </View>
        </CompactView>
      </TabsPageView>
    )
  );
};
