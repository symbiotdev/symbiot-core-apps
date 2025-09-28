import { BrandLocation } from './brand-location';
import { Currency } from './currency';
import { BrandService } from './brand-service';

export type BrandMembership = {
  id: string;
  name: string;
  description: string;
  note: string;
  price: number;
  discount: number;
  hidden: boolean;
  visibility: number;
  currency: Currency;
  location: BrandLocation;
  services: BrandService[];
};

export type CreateBrandMembership = {
  name: string;
  description: string;
  note: string;
  price: number;
  discount: number;
  hidden: boolean;
  visibility: number;
  currency: string;
  location: string;
  services: string[];
};

export type UpdateBrandMembership = Partial<CreateBrandMembership>;
