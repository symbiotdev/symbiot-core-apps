export enum AccountSubscriptionEnvironment {
  sandbox = 'sandbox',
  production = 'production',
}

export type AccountSubscription = {
  store: string;
  product: string;
  active: boolean;
  renewable: boolean;
  expiresDate: string | null;
  environment: AccountSubscriptionEnvironment;
};

export type CreateAccountSubscription = AccountSubscription & {
  userId: string;
};

export type UpdateAccountSubscription = {
  store: string;
  active: boolean;
  product: string;
  renewable: boolean;
  expiresDate: string | null;
};
