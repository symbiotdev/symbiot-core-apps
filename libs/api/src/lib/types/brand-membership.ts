import { BrandLocation } from './brand-location';
import { Currency } from './currency';
import { BrandService } from './brand-service';

export enum BrandMembershipType {
  period = 'period',
  visits = 'visits',
}

export type BrandMembershipPeriod = {
  label: string;
  value: string;
};

export type BrandMembership = {
  id: string;
  name: string;
  description: string;
  note: string;
  price: number;
  discount: number;
  hidden: boolean;
  currency: Currency;
  locations: BrandLocation[];
  services: BrandService[];
};

export type BrandPeriodBasedMembership = BrandMembership & {
  period: BrandMembershipPeriod;
};

export type BrandVisitBasedMembership = BrandMembership & {
  visits: number;
};

export type AnyBrandMembership =
  | BrandPeriodBasedMembership
  | BrandVisitBasedMembership;

type CreateBrandMembership = {
  name: string;
  description: string;
  note: string;
  price: number;
  discount: number;
  hidden: boolean;
  currency: string;
  locations: string[];
  services: string[];
};

export type CreateBrandPeriodBasedMembership = CreateBrandMembership & {
  period: string;
};

export type CreateBrandVisitBasedMembership = CreateBrandMembership & {
  visits: number;
};

export type UpdateBrandMembership =
  | Partial<CreateBrandPeriodBasedMembership>
  | Partial<CreateBrandVisitBasedMembership>;
