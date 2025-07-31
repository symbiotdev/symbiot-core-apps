import {
  Card,
  FormView,
  Link,
  PageView,
  RegularText,
  Spinner,
  Switch,
} from '@symbiot-core-apps/ui';
import { useMeUpdater } from '@symbiot-core-apps/state';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  getPermissionsAsync,
  NotificationPermissionsStatus,
} from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { useT } from '@symbiot-core-apps/i18n';

export const Notifications = () => {
  const { t } = useT();
  const { me, updatePreferences$, updating } = useMeUpdater();
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
    (enablePushNotifications: boolean) =>
      updatePreferences$({ enablePushNotifications }),
    [updatePreferences$],
  );

  const toggleNotificationSound = useCallback(
    (enableNotificationSound: boolean) =>
      updatePreferences$({ enableNotificationSound }),
    [updatePreferences$],
  );

  return (
    <PageView scrollable withHeaderHeight gap="$2">
      <FormView>
        {pushNotificationsDenied && (
          <Card>
            <RegularText>
              {t(
                'preferences.notifications.posh_notifications.permissions_denied',
              )}{' '}
              <Link onPress={Linking.openSettings}>{t('settings')}</Link>
            </RegularText>
          </Card>
        )}

        <Card gap="$5">
          {Platform.OS !== 'web' && (
            <Switch
              label={t('preferences.notifications.posh_notifications.label')}
              checked={
                pushNotificationsDenied
                  ? false
                  : me?.preferences?.enablePushNotifications
              }
              disabled={pushNotificationsDenied}
              onChange={togglePushNotifications}
            />
          )}
          <Switch
            label={t('preferences.notifications.sound.label')}
            checked={me?.preferences?.enableNotificationSound}
            onChange={toggleNotificationSound}
          />
        </Card>
      </FormView>
    </PageView>
  );
};
