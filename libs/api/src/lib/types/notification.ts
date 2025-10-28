import { Account } from './account';
import { Brand } from './brand';

export enum NotificationType {
  welcome = 'welcome',
  // brand booking
  unavailableBrandBookingsCreated = 'unavailable_brand_bookings_created',
  unavailableBrandBookingsCanceled = 'unavailable_brand_bookings_canceled',
  unavailableBrandBookingsUpdated = 'unavailable_brand_bookings_updated',
  serviceBrandBookingsCanceled = 'service_brand_bookings_canceled',
  serviceBrandBookingsCreated = 'service_brand_bookings_created',
  serviceBrandBookingsUpdated = 'service_brand_bookings_updated',
  serviceBrandBookingClientAdded = 'service_brand_booking_client_added',
  serviceBrandBookingClientRemoved = 'service_brand_booking_client_removed',
}

export type Notification = {
  id: string;
  type: NotificationType;
  from: Account;
  brand?: Brand;
  title: string;
  subtitle: string;
  read: boolean;
  brandBookingId: string;
  cAt: Date;
};
