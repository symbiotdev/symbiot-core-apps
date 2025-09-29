import { BrandLocation } from './brand-location';
import { Currency } from './currency';
import { BrandService } from './brand-service';

export type BrandTicket = {
  id: string;
  name: string;
  description: string;
  note: string;
  price: number;
  discount: number;
  hidden: boolean;
  visits: number;
  currency: Currency;
  locations: BrandLocation[];
  services: BrandService[];
};

export type CreateBrandTicket = {
  name: string;
  description: string;
  note: string;
  price: number;
  discount: number;
  hidden: boolean;
  currency: string;
  visits: number;
  locations: string[];
  services: string[];
};

export type UpdateBrandTicket = Partial<CreateBrandTicket>;
