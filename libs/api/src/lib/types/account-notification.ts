import { Account } from './account';

export enum AccountNotificationType {
  welcome = 'welcome',
  reminder = 'reminder',
}

export type AccountNotification = {
  id: string;
  from: Account;
  to: Account;
  type: AccountNotificationType
};
