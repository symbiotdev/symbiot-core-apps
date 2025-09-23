import { Gender } from './gender';
import { ImagePickerAsset } from 'expo-image-picker';

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
