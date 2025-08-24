import { Weekday } from '@symbiot-core-apps/shared';

export type Schedule = {
  day: Weekday;
  start: number;
  end: number;
};
