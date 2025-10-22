import { AccountPreferences } from './account-preferences';
import { Gender } from './gender';
import { ImagePickerAsset } from 'expo-image-picker';
import { Attachment } from './attachment';

export type Account = {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  avatarColor: string;
  timezone: string;
  language: string;
  test: boolean;
  hidden: boolean;
  blocked: boolean;
  sourced: boolean;
  firebaseId: string;
  signInProvider: string;
  email: string;
  lastRateDate: string;
  birthday: string;
  avatar: Attachment;
  preferences: AccountPreferences;
  phones: string[];
  instagrams: string[];
  gender: Gender;
};

export type UpdateAccountData = {
  language?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string | null;
  phones?: string[];
  instagrams?: string[];
  gender?: string | null;
  avatar?: ImagePickerAsset;
};
