import { BrandLocation } from './brand-location';
import { BrandIndustryServiceType } from './brand-industry';
import { Gender } from './gender';
import { Phone } from './phone';
import { Schedule } from './schedule';
import { ImagePickerAsset } from 'expo-image-picker';

export type BrandEmployee = {
  id: string;
  about: string;
  avatarColor: string;
  avatarUrl: string;
  avatarXsUrl: string;
  name: string;
  firstname: string;
  lastname: string;
  birthday: string;
  email: string;
  address: string;
  position: string;
  passport: string;
  taxId: string;
  provider: boolean;
  gender: Gender;
  phones: Phone[];
  locations: BrandLocation[];
  schedules: BrandEmployeeSchedule[];
  permissions: BrandEmployeePermissions;
  serviceTypes: BrandIndustryServiceType[];
};

export type BrandEmployeeSchedule = Schedule & {
  location: BrandLocation;
};

export type BrandEmployeePermissions = {
  all: boolean;
  brandAll: boolean;
  analyticsAll: boolean;
  servicesAll: boolean;
  clientsAll: boolean;
  employeesAll: boolean;
  locationsAll: boolean;
};

export type BrandEmployeePermission = {
  key: keyof BrandEmployeePermissions;
  title: string;
  subtitle: string;
};

export type CreateBrandEmployee = {
  avatar: ImagePickerAsset;
  provider: boolean;
  about: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  passport: string;
  taxId: string;
  birthday: string | null;
  position: string;
  gender: string;
  serviceTypes: string[];
  locations: string[];
  permissions: BrandEmployeePermissions;
  phones: Phone[];
  schedules: (Schedule & { location: string | null })[];
};

export type UpdateBrandEmployee = Partial<CreateBrandEmployee>;
