import { Day, Duration } from 'date-fns/types';
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
import { getDateLocale } from '@symbiot-core-apps/i18n';
import { isSameMonth } from 'date-fns/isSameMonth';

const defaultWeekdayStartsOn: Day = 1;

export const DateHelper = {
  isSameDay,
  isSameMonth,
  isAfter,
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
  formatDuration: (duration: Duration) =>
    formatDuration(duration, {
      locale: getDateLocale(),
    }),
  formatDurationFromMinutes: (minutes: number) => {
    const start = DateHelper.startOfDay(new Date());
    const end = DateHelper.addMinutes(start, minutes);

    return DateHelper.formatDuration(
      DateHelper.intervalToDuration({ start, end }),
    );
  },
  startOfWeek: (date: Date, weekStartsOn: Day = defaultWeekdayStartsOn) =>
    startOfWeek(date, {
      weekStartsOn,
    }),
  format: (date: Date, formatStr?: string) => {
    if (formatStr === 'p' && getDateLocale().code === 'uk') {
      formatStr = 'HH:mm';
    } else if (!formatStr) {
      formatStr = 'dd.MM.yyyy';
    }

    return format(date, formatStr, {
      locale: getDateLocale(),
    });
  },
  getWeekdays: (props?: { formatStr: string; weekStartsOn: Day }) => {
    const formatStr = props?.formatStr || 'EEEE';
    const start = DateHelper.startOfWeek(
      new Date(),
      props?.weekStartsOn || defaultWeekdayStartsOn,
    );
    const days: { value: number; label: string }[] = [];

    for (let i = 0; i < 7; i++) {
      const label = DateHelper.format(DateHelper.addDays(start, i), formatStr);

      days.push({
        value: i,
        label: `${label[0].toUpperCase()}${label.slice(1)}`,
      });
    }

    return days;
  },
  getCalendarDates: (
    monthDate: Date,
    weekStartsOn: Day = defaultWeekdayStartsOn,
  ) => {
    const firstDayOfMonth = DateHelper.startOfDay(
      DateHelper.startOfMonth(monthDate),
    );
    const calendarStart = DateHelper.startOfWeek(firstDayOfMonth, weekStartsOn);

    const totalDays = 42;
    const dates: Date[][] = [];

    for (let i = 0; i < totalDays; i++) {
      if (i % 7 === 0) {
        dates.push([]);
      }

      dates[dates.length - 1].push(DateHelper.addDays(calendarStart, i));
    }

    return dates;
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
};
