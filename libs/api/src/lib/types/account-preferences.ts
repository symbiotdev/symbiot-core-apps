import { Scheme, schemes, Weekday } from '@symbiot-core-apps/shared';

export type AccountScheme = Scheme | 'system';

export const accountSchemes: AccountScheme[] = [...schemes, 'system'] as const;

export type AccountPreferences = {
  scheme: AccountScheme;
  enablePushNotifications: boolean;
  enableNotificationSound: boolean;
  enableNotificationVibration: boolean;
  weekStartsOn: Weekday;
  dateFormat: string;
};
