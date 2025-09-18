import { ImagePickerAsset } from 'expo-image-picker';
import { BrandEmployee } from './brand-employee';
import { Gender } from './gender';

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
  gender: Gender;
  employees: BrandEmployee[];
  type: BrandServiceType;
  format: BrandServiceFormat;
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
  gender?: string | null;
  description?: string;
  employees?: string[];
  reminders?: number[];
  avatar?: ImagePickerAsset;
};

export type UpdateBrandService = Partial<CreateBrandService>;
