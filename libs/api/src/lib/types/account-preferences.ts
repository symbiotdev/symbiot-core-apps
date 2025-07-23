import { Day } from 'date-fns';
import { Scheme, schemes } from '@symbiot-core-apps/shared';

export type AccountScheme = Scheme | 'system';

export const accountSchemes: AccountScheme[] = [...schemes, 'system'] as const;

export type AccountPreferences = {
  scheme: AccountScheme;
  enablePushNotifications: boolean;
  enableNotificationSound: boolean;
  enableNotificationVibration: boolean;
  weekStartsOn: Day;
  dateFormat: string;
};
