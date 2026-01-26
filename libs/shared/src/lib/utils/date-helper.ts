import i18n from 'i18next';
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
import { isSameMonth } from 'date-fns/isSameMonth';
import { set } from 'date-fns/set';
import { isValid } from 'date-fns/isValid';
import { endOfDay } from 'date-fns/endOfDay';
import { toDate } from 'date-fns/toDate';
import { setHours } from 'date-fns/setHours';
import { setMinutes } from 'date-fns/setMinutes';
import { setSeconds } from 'date-fns/setSeconds';
import { setMilliseconds } from 'date-fns/setMilliseconds';
import { isEqual } from 'date-fns/isEqual';
import { getMinutes } from 'date-fns/getMinutes';
import { isBefore } from 'date-fns/isBefore';
import { addWeeks } from 'date-fns/addWeeks';
import { endOfMonth } from 'date-fns/endOfMonth';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { capitalizeFirst } from './text';
import { getDate } from 'date-fns/getDate';
import { getMonth } from 'date-fns/getMonth';
import { formatDistance } from 'date-fns/formatDistance';
import { enUS, Locale, uk } from 'date-fns/locale';
import { getAppLanguage } from '../i18n/i18n-provider';
import { parse } from 'date-fns';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Duration = {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export const defaultWeekdayStartsOn: Weekday = 0;
export const minutesInHour = 60;
export const hoursInDay = 24;
export const minutesInDay = hoursInDay * minutesInHour;
export const averageDaysInMonth = 30.4375;
export const averageDaysInYear = 365.25;
export const minutesInYear = averageDaysInYear * minutesInDay;
export const minutesInMonth = averageDaysInMonth * minutesInDay;
export const secondsInHour = minutesInHour * 60;
export const secondsInDay = secondsInHour * 24;
export const secondsInMonth = minutesInMonth * 60;

export const DATE_FNS_SUPPORTED_LANGUAGES: Record<string, Locale> = {
  en: enUS,
  uk: uk,
};

export const getDateLocale = (lang: string) => {
  return DATE_FNS_SUPPORTED_LANGUAGES[lang] || enUS;
};

const getAppDateLocale = () => getDateLocale(getAppLanguage());

export const DateHelper = {
  set,
  toDate,
  isSame: isEqual,
  isSameDay,
  isSameMonth,
  isAfter,
  isBefore,
  isValid,
  addMinutes,
  addHours,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfMonth,
  startOfDay,
  endOfDay,
  endOfMonth,
  differenceInMinutes,
  toZonedTime,
  fromZonedTime,
  differenceInHours,
  differenceInDays,
  differenceInCalendarMonths,
  differenceInYears,
  intervalToDuration,
  eachDayOfInterval,
  currentTimezone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  getDateFromFormattedString: (value: string, dateFormat: string) =>
    parse(value, dateFormat, new Date()),
  isValidByFormat: (value: string, dateFormat: string) => {
    const parsed = DateHelper.getDateFromFormattedString(value, dateFormat);

    return isValid(parsed) && format(parsed, dateFormat) === value;
  },
  isSameDateIgnoringYear: (d1: Date | string, d2: Date | string) =>
    getDate(d1) === getDate(d2) && getMonth(d1) === getMonth(d2),
  formatDistance: (laterDate: Date | string, earlierDate: Date | string) => {
    return formatDistance(laterDate, earlierDate, {
      locale: getAppDateLocale(),
    });
  },
  formatDuration: (
    totalMinutes: number,
    params?: {
      shortFormat?: boolean;
      onlyHighestValue?: boolean;
      onlyDuration?: (keyof Duration)[];
    },
  ) => {
    let years: number;
    let remainingMinutesAfterYears: number;
    let months: number;
    let remainingMinutesAfterMonths: number;
    let days: number;
    let remainingMinutesAfterDays: number;
    let hours: number;
    let remainingMinutesAfterHours: number;
    let minutes: number;

    if (
      !params?.onlyDuration?.length ||
      params.onlyDuration.includes('years')
    ) {
      years = Math.floor(totalMinutes / minutesInYear);
      remainingMinutesAfterYears = totalMinutes % minutesInYear;
    } else {
      years = 0;
      remainingMinutesAfterYears = totalMinutes;
    }

    if (
      !params?.onlyDuration?.length ||
      params.onlyDuration.includes('months')
    ) {
      months =
        params?.onlyHighestValue && years
          ? 0
          : Math.floor(remainingMinutesAfterYears / minutesInMonth);
      remainingMinutesAfterMonths = remainingMinutesAfterYears % minutesInMonth;
    } else {
      months = 0;
      remainingMinutesAfterMonths = remainingMinutesAfterYears;
    }

    if (!params?.onlyDuration?.length || params.onlyDuration.includes('days')) {
      days =
        params?.onlyHighestValue && (years || months)
          ? 0
          : Math.floor(remainingMinutesAfterMonths / minutesInDay);
      remainingMinutesAfterDays = remainingMinutesAfterMonths % minutesInDay;
    } else {
      days = 0;
      remainingMinutesAfterDays = remainingMinutesAfterMonths;
    }

    if (
      !params?.onlyDuration?.length ||
      params.onlyDuration.includes('hours')
    ) {
      hours =
        params?.onlyHighestValue && (years || months || days)
          ? 0
          : Math.floor(remainingMinutesAfterDays / 60);
      remainingMinutesAfterHours = remainingMinutesAfterDays % 60;
    } else {
      hours = 0;
      remainingMinutesAfterHours = remainingMinutesAfterDays;
    }

    if (
      !params?.onlyDuration?.length ||
      params.onlyDuration.includes('minutes')
    ) {
      minutes =
        params?.onlyHighestValue && (years || months || days || hours)
          ? 0
          : remainingMinutesAfterHours;
    } else {
      minutes = 0;
    }

    const duration: Record<string, number> = {
      years,
      months,
      days,
      hours,
      minutes,
    };

    if (params?.shortFormat) {
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
      locale: getAppDateLocale(),
    });
  },
  startOfWeek: (date: Date, weekStartsOn: Weekday = defaultWeekdayStartsOn) =>
    startOfWeek(date, {
      weekStartsOn,
    }),
  format: (date: Date | string, formatStr?: string, lang?: string) => {
    if (formatStr === 'p' && getAppDateLocale().code === 'uk') {
      formatStr = 'HH:mm';
    } else if (!formatStr) {
      formatStr = 'dd.MM.yyyy';
    }

    return capitalizeFirst(
      format(date, formatStr, {
        locale: lang ? DATE_FNS_SUPPORTED_LANGUAGES[lang] : getAppDateLocale(),
      }),
    );
  },
  getWeekdays: (props?: { formatStr?: string; weekStartsOn?: Weekday }) => {
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

    return Array.from({ length: minutesInDay / interval + 1 }).map((_, i) => ({
      label: DateHelper.format(DateHelper.addMinutes(start, i * interval), 'p'),
      value: i * interval,
    }));
  },
  isDayOff(start: number, end: number) {
    return !start && !end;
  },
  isAllDay(start: number, end: number, offset = 0) {
    return minutesInDay - (end - start) <= offset;
  },
  changeDateKeepTime: (originalDate: Date | string, newDate: Date | string) => {
    newDate = new Date(newDate);
    originalDate = new Date(originalDate);

    newDate = setHours(newDate, originalDate.getHours());
    newDate = setMinutes(newDate, originalDate.getMinutes());
    newDate = setSeconds(newDate, originalDate.getSeconds());
    newDate = setMilliseconds(newDate, originalDate.getMilliseconds());

    return newDate;
  },
  roundTime: (date: Date | string, minutes: number) => {
    const closestMinutes = Math.ceil(getMinutes(date) / minutes) * minutes;

    date = setMinutes(date, closestMinutes);

    if (closestMinutes >= 60) {
      date = addMinutes(date, minutes);
      date = setMinutes(date, 0);
    }

    return set(date, { seconds: 0, milliseconds: 0 });
  },
};
