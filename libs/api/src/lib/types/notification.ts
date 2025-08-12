import { Account } from './account';

export enum NotificationType {
  welcome = 'welcome',
  reminder = 'reminder',
}

export type Notification = {
  id: string;
  from: Account;
  type: NotificationType;
  title: string;
  subtitle: string;
  read: boolean;
  cAt: Date;
};
