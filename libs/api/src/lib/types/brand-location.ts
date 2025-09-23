import { Schedule } from './schedule';
import { ImagePickerAsset } from 'expo-image-picker';
import { Attachment } from './attachment';
import { BrandCountry } from './brand';
import { Currency } from './currency';

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
  avatarUrl: string;
  avatarXsUrl: string;
  phones: string[];
  emails: string[];
  instagrams: string[];
  currencies: Currency[];
  country: BrandCountry;
  usState: BrandLocationUsState;
  schedules: Schedule[];
  gallery: Attachment[];
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
  currencies?: string[];
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
