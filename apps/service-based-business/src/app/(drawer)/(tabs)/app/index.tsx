import { emitHaptic, useShareApp } from '@symbiot-core-apps/shared';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { router } from 'expo-router';
import {
  ActionCard,
  Avatar,
  Card,
  FormView,
  H3,
  Icon,
  ListItem,
  ListItemGroup,
  MediumText,
  QrCodeModalWithTrigger,
  RegularText,
  TabsPageView,
  useDrawer,
} from '@symbiot-core-apps/ui';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';
import { View, XStack } from 'tamagui';

export default () => {
  const share = useShareApp();
  const { t } = useTranslation();
  const { languages } = useApp();
  const { me } = useCurrentAccount();
  const { visible: drawerVisible } = useDrawer();

  const onAccountPress = useCallback(() => {
    emitHaptic();
    router.push('/app/preferences/account');
  }, []);
  const onAppearancePress = useCallback(
    () => router.push('/app/preferences/appearance'),
    [],
  );
  const onCalendarPress = useCallback(
    () => router.push('/app/preferences/calendar'),
    [],
  );
  const onLanguagePress = useCallback(
    () => router.push('/app/preferences/language'),
    [],
  );
  const onNotificationsPress = useCallback(
    () => router.push('/app/preferences/notifications'),
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

  return (
    me && (
      <TabsPageView scrollable withHeaderHeight>
        <FormView gap="$3">
          <ActionCard
            title={t('subscription.card.title')}
            subtitle={t('subscription.card.subtitle')}
            buttonLabel={t('subscription.card.button.label')}
            buttonIcon={<Icon name="Rocket" />}
            onActionPress={() => {
              alert('get pro');
            }}
          />

          <Card flexDirection="row" alignItems="center" gap="$4">
            <XStack
              alignItems="center"
              gap="$4"
              flex={1}
              cursor="pointer"
              pressStyle={{ opacity: 0.8 }}
              onPress={onAccountPress}
            >
              <Avatar
                url={me.avatarXsUrl}
                name={me.name}
                color={me.avatarColor}
                size={50}
              />
              <View flex={1} gap="$2">
                <H3 numberOfLines={1}>{me.name}</H3>
                <MediumText color="$placeholderColor" numberOfLines={1}>
                  ID: {me.id}
                </MediumText>
              </View>
            </XStack>
            <QrCodeModalWithTrigger
              trigger={<Icon name="QrCode" />}
              qrValue={me.id}
              qrContent={<RegularText fontSize={30}>🤩</RegularText>}
            />
          </Card>

          <ListItemGroup title={t('shared.preferences.title')}>
            <ListItem
              label={t('shared.preferences.notifications.title')}
              icon={<Icon name="Bell" />}
              onPress={onNotificationsPress}
            />
            <ListItem
              label={t('shared.preferences.appearance.title')}
              icon={<Icon name="TuningSquare" />}
              onPress={onAppearancePress}
            />

            {languages?.length > 1 && (
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

          {!drawerVisible && (
            <ListItemGroup title={t('shared.application')}>
              <ListItem
                label={t('shared.share_app')}
                icon={<Icon name="Share" />}
                onPress={share}
              />
              <ListItem
                label={t('shared.faq.title')}
                icon={<Icon name="QuestionCircle" />}
                onPress={onHelpFeedbackPress}
              />
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
          )}
        </FormView>
      </TabsPageView>
    )
  );
};
