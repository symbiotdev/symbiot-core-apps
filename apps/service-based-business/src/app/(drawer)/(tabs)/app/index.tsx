import { useShareApp } from '@symbiot-core-apps/shared';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useCallback } from 'react';
import { router } from 'expo-router';
import {
  ActionCard,
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  QrCodeModalWithTrigger,
  RegularText,
  TabsPageView,
  useDrawer,
} from '@symbiot-core-apps/ui';
import { useApp } from '@symbiot-core-apps/app';
import { useTranslation } from 'react-i18next';

export default () => {
  const share = useShareApp();
  const { t } = useTranslation();
  const { languages } = useApp();
  const { me } = useCurrentAccount();
  const { visible: drawerVisible } = useDrawer();

  const onAccountPress = useCallback(
    () => router.push('/app/preferences/account'),
    [],
  );
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
        <FormView>
          <ActionCard
            title={t('subscription.card.title')}
            subtitle={t('subscription.card.subtitle')}
            buttonLabel={t('subscription.card.button.label')}
            buttonIcon={<Icon name="Rocket" />}
            onActionPress={() => {
              alert('get pro');
            }}
          />

          <ListItemGroup title={t('shared.profile')}>
            <ListItem
              label={me.name}
              icon={<Icon name="UserCircle" />}
              onPress={onAccountPress}
            />

            <QrCodeModalWithTrigger
              trigger={
                <ListItem
                  cursor="pointer"
                  label={t('shared.qr_code')}
                  icon={<Icon name="QrCode" />}
                />
              }
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
