import { AccountPreferences } from './account-preferences';
import { Phone } from './phone';
import { Link } from './link';
import { Gender } from './gender';
import { ImagePickerAsset } from 'expo-image-picker';

export type Account = {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  avatarColor: string;
  avatarUrl: string;
  avatarXsUrl: string;
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
  birthday: Date;
  preferences: AccountPreferences;
  phones: Phone[];
  links: Link[];
  gender: Gender;
};

export type UpdateAccountData = {
  language?: string;
  firstname?: string;
  lastname?: string;
  birthday?: string | null;
  phones?: Phone[];
  links?: Omit<Link, 'id'>[];
  gender?: string | null;
  avatar?: ImagePickerAsset;
};
