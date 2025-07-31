import {
  AppleAuthenticationScope,
  signInAsync,
} from 'expo-apple-authentication';
import { useCallback, useState } from 'react';
import { Button, SocialIcon } from '@symbiot-core-apps/ui';
import { useT } from '@symbiot-core-apps/i18n';

export const AppleAuthButton = ({
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
  const { t } = useT();

  const [loading, setLoading] = useState(false);

  const onPress = useCallback(async () => {
    setLoading(true);

    try {
      const credential = await signInAsync({
        requestedScopes: [
          AppleAuthenticationScope.FULL_NAME,
          AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        onAuth(credential.identityToken);
      }
    } catch (err) {
      const { code, message } = err as { code: string; message: string };

      if (code !== 'ERR_REQUEST_CANCELED' && code !== 'ERR_REQUEST_UNKNOWN') {
        onError(message || code);
      }
    } finally {
      setLoading(false);
    }
  }, [onAuth, onError]);

  return (
    <Button
      loading={loading || pending}
      disabled={disabled}
      icon={<SocialIcon name="Apple" size={20} style={{ marginTop: -4 }} />}
      label={t('auth.workspace.button.continue_with_apple')}
      onPress={onPress}
    />
  );
};
