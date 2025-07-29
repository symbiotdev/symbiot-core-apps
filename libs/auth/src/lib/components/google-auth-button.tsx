import { Button, SocialIcon } from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export const GoogleAuthButton = ({
  pending,
  disabled,
  onAuth,
  onError,
}: {
  pending: boolean;
  disabled: boolean;
  onAuth: (token: string) => void;
  onError: (error: string) => void;
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const onPress = useCallback(async () => {
    setLoading(true);

    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { data } = await GoogleSignin.signIn();

      if (data?.idToken) {
        onAuth(data.idToken);
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
          case '-1':
            break;
          default:
            onError(error.message || error.code);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [onAuth, onError]);

  return (
    <Button
      loading={loading || pending}
      disabled={disabled}
      icon={<SocialIcon name="Google" size={18} />}
      label={t('auth.workspace.button.continue_with_google')}
      onPress={onPress}
    />
  );
};
