export type AccountSignUpData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type AccountAuthSecretResponse = {
  secret: string;
};

export type AccountSignInData = {
  email: string;
  password: string;
};

export type AccountForgotPasswordData = {
  email: string;
};

export type AccountResetPasswordData = {
  password: string;
};

export type AccountAuthTokens = {
  access: string;
  refresh: string;
};
