import { AnyBrandBooking, BrandBookingType } from '../types/brand-booking';
import { DateHelper, minutesInDay } from '@symbiot-core-apps/shared';

export const getTranslateKeyByBrandBookingType = (type?: BrandBookingType) =>
  type === BrandBookingType.unavailable
    ? 'unavailable_brand_booking'
    : 'service_brand_booking';

export const getBrandBookingType = (booking: AnyBrandBooking) =>
  booking.type ||
  ('clients' in booking
    ? BrandBookingType.service
    : BrandBookingType.unavailable);

export const getTranslateKeyByBrandBooking = (booking: AnyBrandBooking) =>
  getTranslateKeyByBrandBookingType(getBrandBookingType(booking));

export const isBrandBookingAllDay = ({
  start,
  end,
}: {
  start: string | Date;
  end: string | Date;
}) => {
  if (DateHelper.isSame(start, end)) {
    return true;
  }

  const diff = DateHelper.differenceInMinutes(start, end);

  return (
    DateHelper.isSameDay(start, end) &&
    (diff === minutesInDay || diff === minutesInDay)
  );
};

export enum BookingRepeatType {
  noRepeat,
  custom,
  daily,
  weekly,
  monthly,
}

export const getMaxDateByRepeatType = (type: BookingRepeatType) => {
  if (type === BookingRepeatType.daily) {
    return DateHelper.addMonths(new Date(), 1);
  } else if (type === BookingRepeatType.weekly) {
    return DateHelper.addMonths(new Date(), 6);
  } else if (type === BookingRepeatType.monthly) {
    return DateHelper.addMonths(new Date(), 12);
  } else {
    return undefined;
  }
};

export const getDatesByRepeatType = ({
  type,
  start,
  end,
}: {
  type: BookingRepeatType;
  start: Date;
  end: Date;
}) => {
  const dates: Date[] = [];
  let current = new Date(start);

  while (
    DateHelper.isBefore(current, end) ||
    current.getTime() === end.getTime()
  ) {
    dates.push(new Date(current));

    switch (type) {
      case BookingRepeatType.daily:
        current = DateHelper.addDays(current, 1);
        break;
      case BookingRepeatType.weekly:
        current = DateHelper.addWeeks(current, 1);
        break;
      case BookingRepeatType.monthly:
        current = DateHelper.addMonths(current, 1);
        break;
      default:
        return [start];
    }
  }

  return dates;
};
