import { AnyBrandBooking, BrandBookingType } from '../types/brand-booking';

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
