import {
  AccountAuthSecretResponse,
  AccountAuthTokens,
  AccountForgotPasswordData,
  AccountSignInData,
  AccountSignUpData,
} from '../types/account-auth';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { requestWithStringError } from '../utils/request';
import { authTokenHeaderKey, useAuthTokens } from '../hooks/use-auth-tokens';
import { Platform } from 'react-native';
import { useCallback } from 'react';

export const useAccountAuthSignUpQuery = () =>
  useMutation<AccountAuthSecretResponse, string, AccountSignUpData>({
    mutationFn: (data) =>
      requestWithStringError(axios.post('/api/account-auth/sign-up', data)),
  });

export const useAccountAuthResendSignUpCodeQuery = () =>
  useMutation<void, string, { secret: string; email: string }>({
    mutationFn: ({ secret, email }) =>
      requestWithStringError(
        axios.post(`/api/account-auth/sign-up/${secret}/resend-code`, {
          email,
        }),
      ),
  });

export const useAccountAuthVerifySignUpQuery = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, { secret: string; code: string }>({
    mutationFn: async ({ secret, code }) => {
      const tokens = (await requestWithStringError(
        axios.post(`/api/account-auth/sign-up/${secret}/verify`, {
          code,
        }),
      )) as AccountAuthTokens;

      setTokens(tokens);
    },
  });
};

export const useAccountAuthSignInQuery = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, AccountSignInData>({
    mutationFn: async (data) => {
      const tokens = (await requestWithStringError(
        axios.post('/api/account-auth/sign-in', data),
      )) as AccountAuthTokens;

      setTokens(tokens);
    },
  });
};

export const useAccountAuthSignInWithFirebaseQuery = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, { token: string }>({
    mutationFn: async ({ token }) => {
      const tokens = (await requestWithStringError(
        axios.post(`/api/account-auth/sign-in/firebase/${token}`),
      )) as AccountAuthTokens;

      setTokens(tokens);
    },
  });
};

export const useAccountAuthForgotPasswordQuery = () =>
  useMutation<AccountAuthSecretResponse, string, AccountForgotPasswordData>({
    mutationFn: (data) =>
      requestWithStringError(
        axios.post(`/api/account-auth/forgot-password`, data),
      ),
  });

export const useAccountAuthResendForgotPasswordCodeQuery = () =>
  useMutation<void, string, { secret: string; email: string }>({
    mutationFn: ({ secret, email }) =>
      requestWithStringError(
        axios.post(`/api/account-auth/forgot-password/${secret}/resend-code`, {
          email,
        }),
      ),
  });

export const useAccountAuthVerifyForgotPasswordQuery = () =>
  useMutation<void, string, { secret: string; code: string; email: string }>({
    mutationFn: ({ secret, code, email }) =>
      requestWithStringError(
        axios.post(`/api/account-auth/forgot-password/${secret}/verify`, {
          code,
          email,
        }),
      ),
  });

export const useAccountAuthResetPasswordQuery = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<
    void,
    string,
    { secret: string; code: string; email: string; password: string }
  >({
    mutationFn: async ({ secret, code, email, password }) => {
      const tokens = (await requestWithStringError(
        axios.post(`/api/account-auth/reset-password/${secret}`, {
          code,
          email,
          password,
        }),
      )) as AccountAuthTokens;

      setTokens(tokens);
    },
  });
};

export const useAccountAuthRefreshTokenQuery = () => {
  const { setTokens, tokens } = useAuthTokens();

  return useCallback(async () => {
    const newTokens = (await requestWithStringError(
      axios.post(
        '/api/account-auth/refresh',
        {},
        Platform.OS !== 'web'
          ? {
              headers: {
                [authTokenHeaderKey.refresh]: tokens.refresh,
              },
            }
          : {},
      ),
    )) as AccountAuthTokens;

    setTokens(newTokens);

    return newTokens;
  }, [setTokens, tokens.refresh]);
};

export const useAccountAuthSignOutQuery = () => {
  const { removeTokens } = useAuthTokens();

  return useMutation({
    mutationFn: async () => {
      await removeTokens();

      return axios.post('/api/account-auth/sign-out');
    },
  });
};
