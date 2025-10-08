import { AnyBrandClientMembership, BrandClient } from './brand-client';
import { Currency } from './currency';

export enum BrandTransactionType {
  manual = 'manual',
  clientPeriodBasedMembership = 'client-period-based-membership',
  clientVisitBasedMembership = 'client-visit-based-membership',
}

export type BrandTransaction = {
  id: string;
  hash: string;
  name: string;
  payer: string;
  price: number;
  discount: number;
  cAt: string;
  currency: Currency;
  client: BrandClient;
  membership: AnyBrandClientMembership;
  type: BrandTransactionType;
};
