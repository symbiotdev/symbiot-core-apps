import {
  AccountAuthSecretResponse,
  AccountAuthTokens,
  AccountForgotPasswordData,
  AccountSignInData,
  AccountSignUpData,
} from '../types/account-auth';
import axios from 'axios';
import { authTokenHeaderKey, useAuthTokens } from '../hooks/use-auth-tokens';
import { Platform } from 'react-native';
import { useCallback } from 'react';
import { useMutation } from '../hooks/use-mutation';

export const useAccountAuthSignUpReq = () =>
  useMutation<AccountAuthSecretResponse, string, AccountSignUpData>({
    mutationFn: (data) => axios.post('/api/account-auth/sign-up', data),
  });

export const useAccountAuthResendSignUpCodeReq = () =>
  useMutation<void, string, { secret: string; email: string }>({
    mutationFn: ({ secret, email }) =>
      axios.post(`/api/account-auth/sign-up/${secret}/resend-code`, {
        email,
      }),
  });

export const useAccountAuthVerifySignUpReq = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, { secret: string; code: string }>({
    mutationFn: async ({ secret, code }) => {
      const tokens = (await axios.post(
        `/api/account-auth/sign-up/${secret}/verify`,
        {
          code,
        },
      )) as AccountAuthTokens;

      setTokens(tokens);
    },
  });
};

export const useAccountAuthSignInReq = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, AccountSignInData>({
    mutationFn: async (data) => {
      const tokens = (await axios.post(
        '/api/account-auth/sign-in',
        data,
      )) as AccountAuthTokens;

      setTokens(tokens);
    },
  });
};

export const useAccountAuthSignInWithFirebaseReq = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, { token: string }>({
    mutationFn: async ({ token }) => {
      const tokens = (await axios.post(
        `/api/account-auth/sign-in/firebase/${token}`,
      )) as AccountAuthTokens;

      setTokens(tokens);
    },
  });
};

export const useAccountAuthForgotPasswordReq = () =>
  useMutation<AccountAuthSecretResponse, string, AccountForgotPasswordData>({
    mutationFn: (data) => axios.post(`/api/account-auth/forgot-password`, data),
  });

export const useAccountAuthResendForgotPasswordCodeReq = () =>
  useMutation<void, string, { secret: string; email: string }>({
    mutationFn: ({ secret, email }) =>
      axios.post(`/api/account-auth/forgot-password/${secret}/resend-code`, {
        email,
      }),
  });

export const useAccountAuthVerifyForgotPasswordReq = () =>
  useMutation<void, string, { secret: string; code: string; email: string }>({
    mutationFn: ({ secret, code, email }) =>
      axios.post(`/api/account-auth/forgot-password/${secret}/verify`, {
        code,
        email,
      }),
  });

export const useAccountAuthResetPasswordReq = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<
    void,
    string,
    { secret: string; code: string; email: string; password: string }
  >({
    mutationFn: async ({ secret, code, email, password }) => {
      const tokens = (await axios.post(
        `/api/account-auth/reset-password/${secret}`,
        {
          code,
          email,
          password,
        },
      )) as AccountAuthTokens;

      setTokens(tokens);
    },
  });
};

export const useAccountAuthRefreshTokenReq = () => {
  const { setTokens, tokens } = useAuthTokens();

  return useCallback(async () => {
    const newTokens = (await axios.post(
      '/api/account-auth/refresh',
      {},
      Platform.OS !== 'web'
        ? {
            headers: {
              [authTokenHeaderKey.refresh]: tokens.refresh,
            },
          }
        : {},
    )) as AccountAuthTokens;

    setTokens(newTokens);

    return newTokens;
  }, [setTokens, tokens.refresh]);
};

export const useAccountAuthSignOutReq = () => {
  const { removeTokens, tokens } = useAuthTokens();

  return useMutation({
    mutationFn: async () => {
      await removeTokens();

      return axios.post(
        '/api/account-auth/sign-out',
        {},
        {
          headers: {
            [authTokenHeaderKey.access]: tokens.access,
          },
        },
      );
    },
  });
};
