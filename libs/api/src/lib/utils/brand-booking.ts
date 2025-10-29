import {
  AnyBrandBooking,
  BrandBookingFrequency,
  BrandBookingType,
} from '../types/brand-booking';
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

export const getEndDateByBrandBookingFrequency = (
  frequency: BrandBookingFrequency,
) => {
  if (
    frequency === BrandBookingFrequency.everyWorkday ||
    frequency === BrandBookingFrequency.everyDay
  ) {
    return DateHelper.addMonths(new Date(), 1);
  } else if (frequency === BrandBookingFrequency.everyWeek) {
    return DateHelper.addMonths(new Date(), 6);
  } else if (frequency === BrandBookingFrequency.everyMonth) {
    return DateHelper.addMonths(new Date(), 12);
  } else {
    return undefined;
  }
};
