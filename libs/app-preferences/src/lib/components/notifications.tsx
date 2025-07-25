import {
  Card,
  FormView,
  Link,
  PageView,
  RegularText,
  Spinner,
  Switch,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useMeUpdater } from '@symbiot-core-apps/store';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  getPermissionsAsync,
  NotificationPermissionsStatus,
} from 'expo-notifications';
import { Linking, Platform } from 'react-native';

export const Notifications = () => {
  const { t } = useTranslation();
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
                'shared.preferences.notifications.posh_notifications.permissions_denied',
              )}{' '}
              <Link onPress={Linking.openSettings}>{t('shared.settings')}</Link>
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
                  : me?.preferences?.enablePushNotifications
              }
              disabled={updating || pushNotificationsDenied}
              onChange={togglePushNotifications}
            />
          )}
          <Switch
            label={t('shared.preferences.notifications.sound.label')}
            checked={me?.preferences?.enableNotificationSound}
            disabled={updating}
            onChange={toggleNotificationSound}
          />
        </Card>
      </FormView>
    </PageView>
  );
};
