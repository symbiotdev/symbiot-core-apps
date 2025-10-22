import { Schedule } from './schedule';
import { ImagePickerAsset } from 'expo-image-picker';
import { Attachment } from './attachment';
import { BrandCountry } from './brand';

export type BrandLocationAdvantage = {
  label: string;
  value: string;
};

export type BrandLocationUsState = {
  name: string;
  abbreviation: string;
  territory: boolean;
  contiguous: boolean;
};

export type BrandLocation = {
  id: string;
  name: string;
  address: string;
  timezone: string;
  remark: string;
  floor: string;
  entrance: string;
  phones: string[];
  emails: string[];
  instagrams: string[];
  country: BrandCountry;
  usState: BrandLocationUsState;
  schedules: Schedule[];
  gallery: Attachment[];
  avatar: Attachment;
  advantages: BrandLocationAdvantage[];
};

export type CreateBrandLocation = {
  name: string;
  address: string;
  country?: string | null;
  usState?: string | null;
  remark?: string;
  floor?: string;
  entrance?: string;
  instagrams?: string[];
  advantages?: string[];
  phones?: string[];
  emails?: string[];
  schedules: Schedule[];
  avatar?: ImagePickerAsset;
};

export type UpdateBrandLocation = Partial<CreateBrandLocation> & {
  timezone?: string;
};
