import {
  AccountAuthSecretResponse,
  AccountAuthTokens,
  AccountForgotPasswordData,
  AccountSignInData,
  AccountSignUpData,
} from '../types/account-auth';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { getRequestErrorMessage } from '../utils/request';
import { authTokenHeaderKey, useAuthTokens } from '../hooks/use-auth-tokens';
import { Platform } from 'react-native';
import { useCallback } from 'react';

export const useAccountAuthSignUpQuery = () =>
  useMutation<AccountAuthSecretResponse, string, AccountSignUpData>({
    mutationFn: async (data) => {
      try {
        return await axios.post('/api/account-auth/sign-up', data);
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });

export const useAccountAuthResendSignUpCodeQuery = () =>
  useMutation<void, string, { secret: string; email: string }>({
    mutationFn: ({ secret, email }) => {
      try {
        return axios.post(`/api/account-auth/sign-up/${secret}/resend-code`, {
          email,
        });
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });

export const useAccountAuthVerifySignUpQuery = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, { secret: string; code: string }>({
    mutationFn: async ({ secret, code }) => {
      try {
        const tokens = (await axios.post(
          `/api/account-auth/sign-up/${secret}/verify`,
          {
            code,
          },
        )) as AccountAuthTokens;

        setTokens(tokens);

        return undefined;
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });
};

export const useAccountAuthSignInQuery = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, AccountSignInData>({
    mutationFn: async (data) => {
      try {
        const tokens = (await axios.post(
          '/api/account-auth/sign-in',
          data,
        )) as AccountAuthTokens;

        setTokens(tokens);

        return undefined;
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });
};

export const useAccountAuthSignInWithFirebaseQuery = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<void, string, { token: string }>({
    mutationFn: async ({ token }) => {
      try {
        const tokens = (await axios.post(
          `/api/account-auth/sign-in/firebase/${token}`,
        )) as AccountAuthTokens;

        setTokens(tokens);

        return undefined;
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });
};

export const useAccountAuthForgotPasswordQuery = () =>
  useMutation<AccountAuthSecretResponse, string, AccountForgotPasswordData>({
    mutationFn: async (data) => {
      try {
        return await axios.post(`/api/account-auth/forgot-password`, data);
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });

export const useAccountAuthResendForgotPasswordCodeQuery = () =>
  useMutation<void, string, { secret: string; email: string }>({
    mutationFn: ({ secret, email }) => {
      try {
        return axios.post(
          `/api/account-auth/forgot-password/${secret}/resend-code`,
          {
            email,
          },
        );
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });

export const useAccountAuthVerifyForgotPasswordQuery = () =>
  useMutation<void, string, { secret: string; code: string; email: string }>({
    mutationFn: async ({ secret, code, email }) => {
      try {
        await axios.post(`/api/account-auth/forgot-password/${secret}/verify`, {
          code,
          email,
        });

        return undefined;
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });

export const useAccountAuthResetPasswordQuery = () => {
  const { setTokens } = useAuthTokens();

  return useMutation<
    void,
    string,
    { secret: string; code: string; email: string; password: string }
  >({
    mutationFn: async ({ secret, code, email, password }) => {
      try {
        const tokens = (await axios.post(
          `/api/account-auth/reset-password/${secret}`,
          {
            code,
            email,
            password,
          },
        )) as AccountAuthTokens;

        setTokens(tokens);

        return undefined;
      } catch (error) {
        throw getRequestErrorMessage(error);
      }
    },
  });
};

export const useAccountAuthRefreshTokenQuery = () => {
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

export const useAccountAuthSignOutQuery = () => {
  const { removeTokens } = useAuthTokens();

  return useMutation({
    mutationFn: async () => {
      await removeTokens();

      return axios.post('/api/account-auth/sign-out');
    },
  });
};
