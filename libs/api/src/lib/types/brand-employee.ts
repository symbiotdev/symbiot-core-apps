import { BrandLocation } from './brand-location';
import { Gender } from './gender';
import { Schedule } from './schedule';
import { ImagePickerAsset } from 'expo-image-picker';
import { Attachment } from './attachment';

export type BrandEmployee = {
  id: string;
  about: string;
  avatarColor: string;
  name: string;
  firstname: string;
  lastname: string;
  birthday: string;
  emails: string[];
  addresses: string[];
  role: string;
  passport: string;
  taxId: string;
  cAt: string;
  provider: boolean;
  gender: Gender;
  phones: string[];
  instagrams: string[];
  avatar: Attachment;
  locations: BrandLocation[];
  schedules: BrandEmployeeSchedule[];
  permissions: BrandEmployeePermissions;
};

export type BrandEmployeeSchedule = Schedule & {
  location?: string;
};

export type BrandEmployeePermissions = {
  brand: boolean;
  notifications: boolean;
  finances: boolean;
  analytics: boolean;
  catalog: boolean;
  bookings: boolean;
  clients: boolean;
  employees: boolean;
  locations: boolean;
};

export type BrandEmployeePermission = {
  key: keyof BrandEmployeePermissions;
  title: string;
  subtitle: string;
};

export type CreateBrandEmployee = {
  avatar?: ImagePickerAsset;
  provider: boolean;
  about: string;
  firstname: string;
  lastname: string;
  emails: string[];
  addresses: string[];
  passport: string;
  taxId: string;
  birthday: string | null;
  role: string;
  gender: string;
  locations: string[];
  permissions: Partial<BrandEmployeePermissions>;
  phones: string[];
  schedules: (Schedule & { location: string | null })[];
};

export type UpdateBrandEmployee = Partial<CreateBrandEmployee>;
