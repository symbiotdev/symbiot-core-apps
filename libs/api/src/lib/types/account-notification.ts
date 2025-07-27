import { Account } from './account';

export enum AccountNotificationType {
  welcome = 'welcome',
  reminder = 'reminder',
}

export type AccountNotification = {
  id: string;
  from: Account;
  type: AccountNotificationType;
  title: string;
  subtitle: string;
  read: boolean;
  cAt: Date;
};
