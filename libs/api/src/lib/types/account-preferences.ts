import { Scheme, Weekday } from '@symbiot-core-apps/shared';

export type AccountPreferences = {
  pushNotifications: boolean;
  notificationsSound: boolean;
  notificationsVibration: boolean;
  dateFormat: string;
  timeFormat: string;
  appearance: AccountAppearance;
};

export type AccountAppearance = {
  scheme?: Scheme | null;
  calendar?: {
    weekStartsOn?: Weekday;
    countDays?: {
      landscape?: number;
      portrait?: number;
    };
  };
};
