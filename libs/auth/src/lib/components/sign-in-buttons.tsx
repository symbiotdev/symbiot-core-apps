import { AppleAuthButton } from './apple-auth-button';
import { useCallback, useMemo, useState } from 'react';
import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleAuthButton } from './google-auth-button';
import { isAvailableAsync } from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { Button, Error, FormView, Icon } from '@symbiot-core-apps/ui';
import { router } from 'expo-router';
import { useAccountAuthSignInWithFirebaseReq } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';

const isGoogleAuthAvailable = Platform.OS !== 'web';

export const SignInButtons = () => {
  const { t } = useTranslation();
  const {
    mutate: appleAuth,
    error: appleAuthError,
    isPending: isAppleAuthPending,
  } = useAccountAuthSignInWithFirebaseReq();
  const {
    mutate: googleAuth,
    error: googleAuthError,
    isPending: isGoogleAuthPending,
  } = useAccountAuthSignInWithFirebaseReq();

  const [error, setError] = useState<string>();
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

  const isPending = useMemo(
    () => isAppleAuthPending || isGoogleAuthPending,
    [isAppleAuthPending, isGoogleAuthPending],
  );

  const anyError = useMemo(
    () => error || appleAuthError || googleAuthError,
    [appleAuthError, error, googleAuthError],
  );

  const signInWithFirebase = useCallback(
    async (credential: FirebaseAuthTypes.AuthCredential) => {
      setError(undefined);

      const { user } = await FirebaseAuth().signInWithCredential(credential);

      if (user) {
        return user.getIdToken();
      } else {
        const errorText = t('shared.error.unknown_error');

        setError(errorText);

        throw errorText;
      }
    },
    [t],
  );

  const signUp = useCallback(() => {
    router.push('/sign-up');
  }, []);

  const signIn = useCallback(() => {
    router.push('/sign-in');
  }, []);

  if (Platform.OS === 'ios') {
    isAvailableAsync().then(setIsAppleAuthAvailable);
  }

  const onAuthWithApple = useCallback(
    async (token: string) => {
      appleAuth({
        token: await signInWithFirebase(
          FirebaseAuth.AppleAuthProvider.credential(token),
        ),
      });
    },
    [appleAuth, signInWithFirebase],
  );
  const onAuthWithGoogle = useCallback(
    async (token: string) =>
      googleAuth({
        token: await signInWithFirebase(
          FirebaseAuth.GoogleAuthProvider.credential(token),
        ),
      }),
    [googleAuth, signInWithFirebase],
  );

  return (
    <FormView>
      {isAppleAuthAvailable && (
        <AppleAuthButton
          pending={isAppleAuthPending}
          disabled={isPending}
          onAuth={onAuthWithApple}
          onError={setError}
        />
      )}

      {isGoogleAuthAvailable && (
        <GoogleAuthButton
          pending={isGoogleAuthPending}
          disabled={isPending}
          onAuth={onAuthWithGoogle}
          onError={setError}
        />
      )}

      <Button
        disabled={isPending}
        icon={<Icon name="Letter" size={20} />}
        label={t('shared.auth.workspace.button.sign_up_with_email')}
        onPress={signUp}
      />

      <Button
        disabled={isPending}
        label={t('shared.auth.workspace.button.sign_in')}
        onPress={signIn}
      />

      {anyError && <Error textAlign="center">{anyError}</Error>}
    </FormView>
  );
};
