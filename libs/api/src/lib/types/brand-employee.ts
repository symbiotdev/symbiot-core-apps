import { BrandLocation } from './brand-location';
import { Gender } from './gender';
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
  emails: string[];
  addresses: string[];
  role: string;
  passport: string;
  taxId: string;
  provider: boolean;
  gender: Gender;
  phones: string[];
  instagrams: string[];
  locations: BrandLocation[];
  schedules: BrandEmployeeSchedule[];
  permissions: BrandEmployeePermissions;
};

export type BrandEmployeeSchedule = Schedule & {
  location: BrandLocation;
};

export type BrandEmployeePermissions = {
  brandAll: boolean;
  financesAll: boolean;
  analyticsAll: boolean;
  catalogAll: boolean;
  bookingAll: boolean;
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
