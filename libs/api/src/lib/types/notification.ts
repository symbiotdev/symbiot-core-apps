import { Account } from './account';
import { Brand } from './brand';

export enum NotificationType {
  welcome = 'welcome',
  reminder = 'reminder',
}

export type Notification = {
  id: string;
  type: NotificationType;
  from: Account;
  brand?: Brand;
  title: string;
  subtitle: string;
  read: boolean;
  cAt: Date;
};
