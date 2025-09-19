import { ImagePickerAsset } from 'expo-image-picker';
import { Account } from './account';
import { Link } from './link';
import { BrandLocation } from './brand-location';

export type BrandCountry = {
  flag: string;
  label: string;
  value: string;
};

export type BrandCurrency = {
  symbol: string;
  label: string;
  value: string;
};

export type BrandIndustry = {
  label: string;
  value: string;
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
  links: Link[];
  industries: BrandIndustry[];
  countries: BrandCountry[];
  currencies: BrandCurrency[];
  locations: BrandLocation[];
  instagrams: string[];
  websites: string[];
};

export type CreateBrand = {
  name: string;
  countries: string[];
  avatar?: ImagePickerAsset;
  promoCode?: string;
  industries?: string[];
  referralSource?: string;
  competitorSource?: string;
  links?: Omit<Link, 'id'>[];
};

export type UpdateBrand = {
  avatar?: ImagePickerAsset;
  links?: Omit<Link, 'id'>[];
  birthday?: string | null;
  name?: string;
  about?: string;
  countries?: string[];
  currencies?: string[];
  instagrams?: string[];
  websites?: string[];
};
