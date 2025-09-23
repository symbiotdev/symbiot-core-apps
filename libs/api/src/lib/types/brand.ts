import { ImagePickerAsset } from 'expo-image-picker';
import { Account } from './account';
import { BrandLocation } from './brand-location';
import { Currency } from './currency';

export type BrandCountry = {
  flag: string;
  label: string;
  value: string;
};

export type BrandIndustry = {
  label: string;
  value: string;
};

export type BrandSourceOption = {
  label: string;
  value: string;
  free?: true;
};

export type Brand = {
  id: string;
  name: string;
  avatarColor: string;
  avatarUrl: string;
  avatarXsUrl: string;
  about: string;
  birthday: string;
  owner: Account;
  industries: BrandIndustry[];
  countries: BrandCountry[];
  currencies: Currency[];
  locations: BrandLocation[];
  instagrams: string[];
  websites: string[];
};

export type CreateBrand = {
  name: string;
  avatar?: ImagePickerAsset;
  promoCode?: string | null;
  referralSource?: string | null;
  competitorSource?: string | null;
  countries: string[];
  industries?: string[];
  websites?: string[];
};

export type UpdateBrand = {
  avatar?: ImagePickerAsset;
  birthday?: string | null;
  name?: string;
  about?: string;
  countries?: string[];
  currencies?: string[];
  instagrams?: string[];
  websites?: string[];
};
