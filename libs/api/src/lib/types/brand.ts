import { ImagePickerAsset } from 'expo-image-picker';
import { BrandIndustry } from './brand-industry';
import { Account } from './account';
import { Link } from './link';

export type Brand = {
  id: string;
  name: string;
  avatarColor: string;
  avatarUrl: string;
  avatarXsUrl: string;
  owner: Account;
  industries: BrandIndustry[];
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
