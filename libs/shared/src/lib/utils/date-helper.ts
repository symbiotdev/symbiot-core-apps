import { Day } from 'date-fns/types';
import { startOfWeek } from 'date-fns/startOfWeek';
import { format } from 'date-fns/format';
import { addDays } from 'date-fns/addDays';
import { startOfMonth } from 'date-fns/startOfMonth';
import { isSameDay } from 'date-fns/isSameDay';
import { addMonths } from 'date-fns/addMonths';
import { startOfDay } from 'date-fns/startOfDay';
import { addHours } from 'date-fns/addHours';
import { differenceInHours } from 'date-fns/differenceInHours';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { addMinutes } from 'date-fns/addMinutes';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { differenceInDays } from 'date-fns/differenceInDays';
import { differenceInCalendarMonths } from 'date-fns/differenceInCalendarMonths';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { isAfter } from 'date-fns/isAfter';
import { differenceInYears } from 'date-fns/differenceInYears';
import { addYears } from 'date-fns/addYears';
import {
  DATE_FNS_SUPPORTED_LANGUAGES,
  getDateLocale,
} from '@symbiot-core-apps/i18n';
import { isSameMonth } from 'date-fns/isSameMonth';
import { toDate } from 'date-fns/toDate';
import { set } from 'date-fns/set';
import { isValid } from 'date-fns/isValid';
import i18n from 'i18next';

export const defaultWeekdayStartsOn: Day = 0;
export const minutesInHour = 60;
export const hoursInDay = 24;
export const minutesInDay = hoursInDay * minutesInHour;
export const averageDaysInMonth = 30.4375;
export const averageDaysInYear = 365.25;
export const minutesInYear = averageDaysInYear * minutesInDay;
export const minutesInMonth = averageDaysInMonth * minutesInDay;

export type Weekday = Day;

export const DateHelper = {
  set,
  toDate,
  isSameDay,
  isSameMonth,
  isAfter,
  isValid,
  addMinutes,
  addHours,
  addDays,
  addMonths,
  addYears,
  startOfMonth,
  startOfDay,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInCalendarMonths,
  differenceInYears,
  intervalToDuration,
  eachDayOfInterval,
  formatDuration: (totalMinutes: number, shortFormat?: boolean) => {
    const years = Math.floor(totalMinutes / minutesInYear);
    const remainingMinutesAfterYears = totalMinutes % minutesInYear;

    const months = Math.floor(remainingMinutesAfterYears / minutesInMonth);
    const remainingMinutesAfterMonths =
      remainingMinutesAfterYears % minutesInMonth;

    const days = Math.floor(remainingMinutesAfterMonths / minutesInDay);
    const remainingMinutesAfterDays =
      remainingMinutesAfterMonths % minutesInDay;

    const hours = Math.floor(remainingMinutesAfterDays / 60);
    const minutes = remainingMinutesAfterDays % 60;

    const duration: Record<string, number> = {
      years,
      months,
      days,
      hours,
      minutes,
    };

    if (shortFormat) {
      return Object.keys(duration)
        .filter((key) => duration[key])
        .map(
          (key) =>
            `${duration[key]}${i18n.t(`shared.datetime.short_format.${key}`)}`,
          '',
        )
        .join(' ');
    }

    return formatDuration(duration, {
      locale: getDateLocale(),
    });
  },
  startOfWeek: (date: Date, weekStartsOn: Day = defaultWeekdayStartsOn) =>
    startOfWeek(date, {
      weekStartsOn,
    }),
  format: (date: Date | string, formatStr?: string, lang?: string) => {
    if (formatStr === 'p' && getDateLocale().code === 'uk') {
      formatStr = 'HH:mm';
    } else if (!formatStr) {
      formatStr = 'dd.MM.yyyy';
    }

    return format(date, formatStr, {
      locale: lang ? DATE_FNS_SUPPORTED_LANGUAGES[lang] : getDateLocale(),
    });
  },
  getWeekdays: (props?: { formatStr?: string; weekStartsOn?: Day }) => {
    const formatStr = props?.formatStr ?? 'EEEE';
    const start = DateHelper.startOfWeek(
      new Date(),
      props?.weekStartsOn ?? defaultWeekdayStartsOn,
    );
    const days: { value: number; label: string }[] = [];

    for (let i = 0; i < 7; i++) {
      const date = DateHelper.addDays(start, i);
      const label = DateHelper.format(date, formatStr);

      days.push({
        value: date.getDay(),
        label: `${label[0].toUpperCase()}${label.slice(1)}`,
      });
    }

    return days;
  },
  get24Hours: () =>
    Array.from({ length: 24 }).map((_, i) => ({
      label: i < 10 ? `0${i}` : String(i),
      value: i,
    })),
  getMinutes: (interval = 5) =>
    Array.from({ length: 60 / Math.ceil(interval) }).map((_, i) => {
      const minutes = i * interval;

      return {
        label: minutes < 10 ? `0${minutes}` : String(minutes),
        value: minutes,
      };
    }),
  get24HoursInFormattedTime: (interval = 15) => {
    const start = DateHelper.startOfDay(new Date());

    return Array.from({ length: minutesInDay / interval }).map((_, i) => ({
      label: DateHelper.format(DateHelper.addMinutes(start, i * interval), 'p'),
      value: i * interval,
    }));
  },
  isDayOff(start: number, end: number) {
    return !start && !end;
  },
  isAllDay(start: number, end: number, offset = 15) {
    return minutesInDay - (end - start) <= offset;
  },
};
