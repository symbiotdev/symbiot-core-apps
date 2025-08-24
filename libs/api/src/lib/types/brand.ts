import { ImagePickerAsset } from 'expo-image-picker';
import { BrandIndustry } from './brand-industry';
import { Account } from './account';
import { Link } from './link';
import { BrandLocation } from './brand-location';

export type Brand = {
  id: string;
  name: string;
  avatarColor: string;
  avatarUrl: string;
  avatarXsUrl: string;
  about: string;
  birthday: Date;
  owner: Account;
  links: Link[];
  industries: BrandIndustry[];
  locations: BrandLocation[];
};

export type CreateBrand = {
  name: string;
  avatar?: ImagePickerAsset;
  promoCode?: string;
  industries?: string[];
  referralSourceId?: string;
  customReferralSource?: string;
  competitorSourceId?: string;
  customCompetitorSource?: string;
  links?: Omit<Link, 'id'>[];
};

export type UpdateBrandData = {
  avatar?: ImagePickerAsset;
  links?: Omit<Link, 'id'>[];
  birthday?: string | null;
  name?: string;
  about?: string;
};
