import { Link } from './link';
import { Phone } from './phone';
import { Schedule } from './schedule';
import { ImagePickerAsset } from 'expo-image-picker';
import { Attachment } from './attachment';

export type BrandLocation = {
  id: string;
  name: string;
  country: string;
  usState: string;
  currency: string;
  address: string;
  timezone: string;
  email: string;
  remark: string;
  floor: string;
  entrance: string;
  avatarUrl: string;
  avatarXsUrl: string;
  links: Link[];
  phones: Phone[];
  schedules: Schedule[];
  gallery: Attachment[];
  advantages: BrandLocationAdvantage[];
};

export type CreateBrandLocation = {
  name: string;
  country: string;
  usState?: string;
  address: string;
  email?: string;
  remark?: string;
  floor?: string;
  entrance?: string;
  advantages?: string[];
  links: Omit<Link, 'id'>[];
  phones: Phone[];
  schedules: Schedule[];
  avatar?: ImagePickerAsset;
};

export type UpdateBrandLocation = Partial<CreateBrandLocation> & {
  timezone?: string;
  currency?: string;
};

export type BrandLocationAdvantage = {
  id: string;
  name: string;
  rate: number;
  iconName: string;
};
