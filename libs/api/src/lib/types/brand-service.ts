import { ImagePickerAsset } from 'expo-image-picker';
import { BrandEmployee } from './brand-employee';
import { Gender } from './gender';
import { Currency } from './currency';
import { BrandLocation } from './brand-location';

export type BrandServiceFormat = {
  label: string;
  description: string;
  value: string;
  fixed: boolean;
};

export type BrandServiceType = {
  label: string;
  value: string;
};

export type BrandService = {
  id: string;
  name: string;
  description: string;
  note: string;
  duration: number;
  price: number;
  discount: number;
  hidden: boolean;
  places: number;
  avatarUrl: string;
  avatarXsUrl: string;
  reminders: number[];
  currency: Currency;
  gender: Gender;
  type: BrandServiceType;
  format: BrandServiceFormat;
  locations: BrandLocation[];
  employees: BrandEmployee[];
};

export type CreateBrandService = {
  name: string;
  type: string;
  format: string;
  price: number;
  discount: number;
  places: number;
  duration: number;
  hidden: boolean;
  note?: string;
  currency?: string;
  gender?: string | null;
  description?: string;
  locations?: string[];
  employees?: string[];
  reminders?: number[];
  avatar?: ImagePickerAsset;
};

export type UpdateBrandService = Partial<CreateBrandService>;
