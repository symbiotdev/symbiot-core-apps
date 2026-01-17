export enum AccountSubscriptionType {
  serviceBrand = 'service_brand',
}

export enum AccountSubscriptionEnvironment {
  sandbox = 'sandbox',
  production = 'production',
}

export type AccountSubscription = {
  type: AccountSubscriptionType;
  store: string;
  product: string;
  active: boolean;
  canceled: boolean;
  expiresDate: string | null;
  environment: AccountSubscriptionEnvironment;
};
