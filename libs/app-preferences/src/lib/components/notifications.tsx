import {
  Card,
  CompactView,
  Link,
  PageView,
  RegularText,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useCurrentAccountUpdater } from '@symbiot-core-apps/state';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  getPermissionsAsync,
  NotificationPermissionsStatus,
} from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { useI18n } from '@symbiot-core-apps/shared';
import { Switch } from '@symbiot-core-apps/form-controller';

export const Notifications = () => {
  const { t } = useI18n();
  const { me, updatePreferences$, updating } = useCurrentAccountUpdater();
  const navigation = useNavigation();

  const [permissionsStatus, setPermissionsStatus] =
    useState<NotificationPermissionsStatus>();
  const pushNotificationsDenied =
    Platform.OS !== 'web' && permissionsStatus && !permissionsStatus.granted;

  useEffect(() => {
    getPermissionsAsync().then(setPermissionsStatus);

    navigation.setOptions({
      headerRight: updating ? () => <Spinner /> : undefined,
    });
  }, [updating, navigation]);

  const togglePushNotifications = useCallback(
    (pushNotifications: boolean) => updatePreferences$({ pushNotifications }),
    [updatePreferences$],
  );

  const toggleNotificationSound = useCallback(
    (notificationsSound: boolean) => updatePreferences$({ notificationsSound }),
    [updatePreferences$],
  );

  return (
    <PageView scrollable withHeaderHeight gap="$2">
      <CompactView>
        {pushNotificationsDenied && (
          <Card>
            <RegularText>
              {t(
                'shared.preferences.notifications.posh_notifications.permissions_denied',
              )}{' '}
              <Link onPress={Linking.openSettings}>{t('settings')}</Link>
            </RegularText>
          </Card>
        )}

        <Card gap="$5">
          {Platform.OS !== 'web' && (
            <Switch
              label={t(
                'shared.preferences.notifications.posh_notifications.label',
              )}
              checked={
                pushNotificationsDenied
                  ? false
                  : me?.preferences?.pushNotifications
              }
              disabled={pushNotificationsDenied}
              onChange={togglePushNotifications}
            />
          )}
          <Switch
            label={t('shared.preferences.notifications.sound.label')}
            checked={me?.preferences?.notificationsSound}
            onChange={toggleNotificationSound}
          />
        </Card>
      </CompactView>
    </PageView>
  );
};
