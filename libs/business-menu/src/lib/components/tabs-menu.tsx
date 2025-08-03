import {
  ActionCard,
  FormView,
  Icon,
  ListItem,
  ListItemGroup,
  QrCodeModalWithTrigger,
  RegularText,
  TabsPageView,
} from '@symbiot-core-apps/ui';
import {
  ConfirmAlert,
  DeviceVersion,
  useShareApp,
} from '@symbiot-core-apps/shared';
import { useAccountAuthSignOutQuery } from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { useMe } from '@symbiot-core-apps/state';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { useT } from '@symbiot-core-apps/i18n';

export const TabsMenu = () => {
  const share = useShareApp();
  const { t } = useT();
  const { me } = useMe();
  const { mutate: signOut } = useAccountAuthSignOutQuery();

  const onAccountPress = useCallback(
    () => router.push('/preferences/account'),
    [],
  );
  const onAppearancePress = useCallback(
    () => router.push('/preferences/appearance'),
    [],
  );
  const onCalendarPress = useCallback(
    () => router.push('/preferences/calendar'),
    [],
  );
  const onLanguagePress = useCallback(
    () => router.push('/preferences/language'),
    [],
  );
  const onNotificationsPress = useCallback(
    () => router.push('/preferences/notifications'),
    [],
  );
  const onTermsPrivacyPress = useCallback(
    () => router.push('/terms-privacy'),
    [],
  );
  const onFollowUsPress = useCallback(() => router.push('/follow-us'), []);
  const onHelpFeedbackPress = useCallback(
    () => router.push('/help-feedback'),
    [],
  );
  const onSignOutPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('auth.sign_out.confirm.title'),
        callback: signOut,
      }),
    [signOut, t],
  );

  return (
    me && (
      <TabsPageView scrollable>
        <FormView>
          <ActionCard
            title={t('subscription.card.title', {
              ns: 'app',
            })}
            subtitle={t('subscription.card.subtitle', {
              ns: 'app',
            })}
            buttonLabel={t('subscription.card.button.label', {
              ns: 'app',
            })}
            buttonIcon={<Icon name="CrownLine" />}
            onActionPress={() => {
              alert('get pro');
            }}
          />

          <ListItemGroup title={t('profile')}>
            <ListItem
              label={me.name}
              icon={<Icon name="UserCircle" />}
              onPress={onAccountPress}
            />

            <QrCodeModalWithTrigger
              trigger={
                <ListItem label={t('qr_code')} icon={<Icon name="QrCode" />} />
              }
              qrValue={me.id}
              qrContent={<RegularText fontSize={30}>🤩</RegularText>}
            />
          </ListItemGroup>

          <ListItemGroup title={t('preferences.title')}>
            <ListItem
              label={t('preferences.notifications.title')}
              icon={<Icon name="Bell" />}
              onPress={onNotificationsPress}
            />
            <ListItem
              label={t('preferences.appearance.title')}
              icon={<Icon name="TuningSquare" />}
              onPress={onAppearancePress}
            />
            <ListItem
              label={t('preferences.language.title')}
              icon={<Icon name="Global" />}
              onPress={onLanguagePress}
            />
            <ListItem
              label={t('calendar')}
              icon={<Icon name="Calendar" />}
              onPress={onCalendarPress}
            />
          </ListItemGroup>

          <ListItemGroup title={t('application')}>
            <ListItem
              label={t('share_app')}
              icon={<Icon name="Share" />}
              onPress={share}
            />
            <ListItem
              label={t('faq.title')}
              icon={<Icon name="QuestionCircle" />}
              onPress={onHelpFeedbackPress}
            />
            <ListItem
              label={t('docs.terms_privacy')}
              icon={<Icon name="FileText" />}
              onPress={onTermsPrivacyPress}
            />
            <ListItem
              label={t('follow_us')}
              icon={<Icon name="ShareCircle" />}
              onPress={onFollowUsPress}
            />
          </ListItemGroup>

          <ListItemGroup title={t('other')}>
            <ListItem
              label={t('auth.sign_out.button.label')}
              icon={<Icon name="Logout2" />}
              onPress={onSignOutPress}
            />
          </ListItemGroup>

          {Platform.OS !== 'web' && (
            <ListItem
              disabled
              paddingHorizontal="$4"
              color="$disabled"
              label={t('version')}
              icon={<Icon name="CodeCircle" />}
              iconAfter={<RegularText>{DeviceVersion}</RegularText>}
            />
          )}
        </FormView>
      </TabsPageView>
    )
  );
};
