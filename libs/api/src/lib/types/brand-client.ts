import { Gender } from './gender';
import { ImagePickerAsset } from 'expo-image-picker';
import { Currency } from './currency';
import { BrandTicket } from './brand-ticket';
import { BrandMembership, BrandMembershipPeriod } from './brand-membership';

export type BrandClient = {
  id: string;
  firstname: string;
  lastname: string;
  avatarUrl: string;
  avatarXsUrl: string;
  birthday: string;
  note: string;
  addresses: string[];
  emails: string[];
  phones: string[];
  gender: Gender;
  tickets: BrandClientTicket[];
  memberships: BrandClientMembership[];
};

export type CreateBrandClient = {
  avatar?: ImagePickerAsset;
  firstname: string;
  lastname: string;
  birthday: string | null;
  gender: string | undefined;
  note: string;
  addresses: string[];
  phones: string[];
  emails: string[];
};

export type UpdateBrandClient = Partial<CreateBrandClient>;
export type ImportBrandClient = Omit<CreateBrandClient, 'avatar' | 'note'> & {
  avatarUrl?: string;
};

export type BrandClientTicket = {
  id: string;
  name: string;
  price: number;
  discount: number;
  visits: number;
  locations: string[];
  services: string[];
  currency: Currency;
  ticket: BrandTicket;
};

export type BrandClientMembership = {
  id: string;
  name: string;
  price: number;
  discount: number;
  endAt: string;
  locations: string[];
  services: string[];
  currency: Currency;
  period: BrandMembershipPeriod;
  membership: BrandMembership;
};
