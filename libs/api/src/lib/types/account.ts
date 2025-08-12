import { AccountPreferences } from './account-preferences';
import { AppLanguage } from '@symbiot-core-apps/i18n';
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
  language: AppLanguage;
  test: boolean;
  hidden: boolean;
  blocked: boolean;
  firebaseId: string;
  signInProvider: string;
  email: string;
  lastVisitDate: string;
  lastRateDate: string;
  birthday: Date;
  preferences: AccountPreferences;
  phones: Phone[];
  links: Link[];
  gender: Gender;
};

export type UpdateAccountData = {
  language?: AppLanguage;
  firstname?: string;
  lastname?: string;
  birthday?: Date | null;
  phones?: Phone[];
  links?: Omit<Link, 'id'>[];
  genderId?: string | null;
  avatar?: ImagePickerAsset;
};
