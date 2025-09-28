import { BrandLocation } from './brand-location';
import { Currency } from './currency';
import { BrandService } from './brand-service';

export type BrandMembershipValidity = {
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
  validity: BrandMembershipValidity;
};

export type CreateBrandMembership = {
  name: string;
  description: string;
  note: string;
  price: number;
  discount: number;
  hidden: boolean;
  currency: string;
  validity: number | null;
  location: string | null;
  services: string[];
};

export type UpdateBrandMembership = Partial<CreateBrandMembership>;
