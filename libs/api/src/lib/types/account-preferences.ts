import { SystemScheme, Weekday } from '@symbiot-core-apps/shared';

export type AccountPreferences = {
  pushNotifications: boolean;
  notificationsSound: boolean;
  notificationsVibration: boolean;
  dateFormat: string;
  timeFormat: string;
  appearance: AccountAppearance;
};

export type DateElementType = 'calendar' | 'input' | null;

export type AccountAppearance = {
  scheme?: SystemScheme | null;
  date?: {
    element?: DateElementType;
  };
  calendar?: {
    weekStartsOn?: Weekday;
    hiddenDays?: Weekday[];
    countDays?: {
      landscape?: number;
      portrait?: number;
    };
  };
};
