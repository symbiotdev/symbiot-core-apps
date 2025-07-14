export type AccountSignUpData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
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
