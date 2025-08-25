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
  lat: number;
  lng: number;
  email: string;
  remark: string;
  avatarUrl: string;
  avatarXsUrl: string;
  links: Link[];
  phones: Phone[];
  schedules: Schedule[];
  gallery: Attachment[];
};

export type CreateBrandLocation = {
  name: string;
  country: string;
  usState?: string;
  address: string;
  lat: number;
  lng: number;
  email?: string;
  remark?: string;
  links: Omit<Link, 'id'>[];
  phones: Phone[];
  schedules: Schedule[];
  avatar?: ImagePickerAsset;
};

export type UpdateBrandLocation = Partial<CreateBrandLocation> & {
  timezone?: string;
  currency?: string;
};
