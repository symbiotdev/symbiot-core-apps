import { Gender } from './gender';
import { Phone } from './phone';
import { ImagePickerAsset } from 'expo-image-picker';

export type BrandClient = {
  id: string;
  firstname: string;
  lastname: string;
  avatarUrl: string;
  avatarXsUrl: string;
  birthday: string;
  email: string;
  address: string;
  note: string;
  gender: Gender;
  phones: Phone[];
};

export type CreateBrandClient = {
  avatar: ImagePickerAsset;
  phones: Phone[];
  firstname: string;
  lastname: string;
  birthday: string | null;
  gender: string | undefined;
  note: string;
  address: string;
  email: string;
};

export type UpdateBrandClient = Partial<CreateBrandClient>;
export type ImportBrandClient = Omit<CreateBrandClient, 'avatar' | 'note'> & {
  avatarUrl?: string;
};
