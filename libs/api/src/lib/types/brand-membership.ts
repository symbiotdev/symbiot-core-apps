import { BrandLocation } from './brand-location';
import { Currency } from './currency';
import { BrandService } from './brand-service';

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
  location: BrandLocation;
  services: BrandService[];
  period: BrandMembershipPeriod;
};

export type CreateBrandMembership = {
  name: string;
  description: string;
  note: string;
  price: number;
  discount: number;
  hidden: boolean;
  currency: string;
  period: string;
  location: string | null;
  services: string[];
};

export type UpdateBrandMembership = Partial<CreateBrandMembership>;
