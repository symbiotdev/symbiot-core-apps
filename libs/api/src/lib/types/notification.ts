import { Account } from './account';
import { Brand } from './brand';
import { BrandClient, BrandClientMembership } from './brand-client';
import { BrandBooking } from './brand-booking';
import { BrandLocation } from './brand-location';
import { BrandEmployee } from './brand-employee';
import { BrandService } from './brand-service';
import { BrandMembership } from './brand-membership';

export enum NotificationType {
  welcome = 'welcome',
  reminder = 'reminder',
  // account subscription
  accountSubscriptionCreated = 'account_subscription_created',
  accountSubscriptionRemoved = 'account_subscription_removed',
  // brand
  brandCreated = 'brand_created',
  brandUpdated = 'brand_updated',
  // brand location
  brandLocationCreated = 'brand_location_created',
  brandLocationUpdated = 'brand_location_updated',
  brandLocationRemoved = 'brand_location_removed',
  // brand employee
  brandEmployeeAssigned = 'brand_employee_assigned',
  brandEmployeeUnassigned = 'brand_employee_unassigned',
  brandEmployeeCreated = 'brand_employee_created',
  brandEmployeeUpdated = 'brand_employee_updated',
  brandEmployeeRemoved = 'brand_employee_removed',
  // brand service
  brandServiceCreated = 'brand_service_created',
  brandServiceUpdated = 'brand_service_updated',
  brandServiceRemoved = 'brand_service_removed',
  // brand period membership
  brandPeriodMembershipCreated = 'brand_period_membership_created',
  brandPeriodMembershipUpdated = 'brand_period_membership_updated',
  brandPeriodMembershipRemoved = 'brand_period_membership_removed',
  // brand visit membership
  brandVisitMembershipCreated = 'brand_visit_membership_created',
  brandVisitMembershipUpdated = 'brand_visit_membership_updated',
  brandVisitMembershipRemoved = 'brand_visit_membership_removed',
  // brand client period membership
  brandClientPeriodMembershipCreated = 'brand_client_period_membership_created',
  brandClientPeriodMembershipUpdated = 'brand_client_period_membership_updated',
  brandClientPeriodMembershipRemoved = 'brand_client_period_membership_removed',
  // brand client visit membership
  brandClientVisitMembershipCreated = 'brand_client_visit_membership_created',
  brandClientVisitMembershipUpdated = 'brand_client_visit_membership_updated',
  brandClientVisitMembershipRemoved = 'brand_client_visit_membership_removed',
  // brand unavailable booking
  unavailableBrandBookingCreated = 'unavailable_brand_booking_created',
  unavailableBrandBookingCanceled = 'unavailable_brand_booking_canceled',
  unavailableBrandBookingUpdated = 'unavailable_brand_booking_updated',
  unavailableBrandBookingUpcoming = 'unavailable_brand_booking_upcoming',
  // brand service booking
  serviceBrandBookingCanceled = 'service_brand_booking_canceled',
  serviceBrandBookingCreated = 'service_brand_booking_created',
  serviceBrandBookingUpdated = 'service_brand_booking_updated',
  serviceBrandBookingUpcoming = 'service_brand_booking_upcoming',
  // brand service booking client
  serviceBrandBookingClientAdded = 'service_brand_booking_client_added',
  serviceBrandBookingClientRemoved = 'service_brand_booking_client_removed',
}

export type Notification = {
  id: string;
  title: string;
  subtitle: string;
  read: boolean;
  cAt: string;
  type: NotificationType;
  from: Account;
  brand?: Brand;
  brandLocation?: BrandLocation;
  brandEmployee?: BrandEmployee;
  brandService?: BrandService;
  brandMembership?: BrandMembership;
  brandClient?: BrandClient;
  brandClientMembership?: BrandClientMembership;
  brandBooking?: BrandBooking;
};
