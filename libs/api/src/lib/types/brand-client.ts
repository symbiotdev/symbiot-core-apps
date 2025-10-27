import { Gender } from './gender';
import { ImagePickerAsset } from 'expo-image-picker';
import { Currency } from './currency';
import {
  BrandMembershipPeriod,
  BrandMembershipType,
  BrandPeriodBasedMembership,
  BrandVisitBasedMembership,
} from './brand-membership';
import { Attachment } from './attachment';

export type BrandClient = {
  id: string;
  firstname: string;
  lastname: string;
  birthday: string;
  note: string;
  addresses: string[];
  emails: string[];
  phones: string[];
  gender: Gender;
  avatar: Attachment;
  memberships: AnyBrandClientMembership[];
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
  avatar?: string;
};

export type BrandClientMembership = {
  id: string;
  name: string;
  price: number;
  discount: number;
  endAt: string;
  dAt: string;
  type: BrandMembershipType;
  locations: { id: string; name: string }[];
  services: { id: string; name: string }[];
  currency: Currency;
};

export type BrandClientPeriodBasedMembership = BrandClientMembership & {
  type: BrandMembershipType.period;
  membership: BrandPeriodBasedMembership;
  period: BrandMembershipPeriod;
};

export type BrandClientVisitBasedMembership = BrandClientMembership & {
  type: BrandMembershipType.visits;
  membership: BrandVisitBasedMembership;
  visits: number;
};

export type AnyBrandClientMembership =
  | BrandClientPeriodBasedMembership
  | BrandClientVisitBasedMembership;

export type UpdateBrandClientMembership = {
  endAt?: string;
  visits?: number;
};
