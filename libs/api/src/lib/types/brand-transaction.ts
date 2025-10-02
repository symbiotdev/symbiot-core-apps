import {
  BrandClient,
  BrandClientMembership,
  BrandClientTicket,
} from './brand-client';
import { Currency } from './currency';

export enum BrandTransactionType {
  manual = 'manual',
  clientMembership = 'client-membership',
  clientTicket = 'client-ticket',
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
  membership: BrandClientMembership;
  ticket: BrandClientTicket;
  type: BrandTransactionType;
};
