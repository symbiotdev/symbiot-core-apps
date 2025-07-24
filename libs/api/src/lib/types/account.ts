import { AccountPreferences } from './account-preferences';
import { AppLanguage } from '@symbiot-core-apps/i18n';

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
  preferences: AccountPreferences;
};

export type UpdateAccountData = {
  language?: AppLanguage;
  firstname?: string;
  lastname?: string;
};
