import { BrandLocation } from './brand-location';
import { BrandEmployee } from './brand-employee';
import { BrandService } from './brand-service';
import { AnyBrandClientMembership, BrandClient } from './brand-client';
import { PaginationListParams } from './pagination';

export enum BrandBookingType {
  service = 'service',
  unavailable = 'unavailable',
}

export enum BrandBookingCancelBy {
  brand = 'brand',
  employee = 'employee',
  client = 'client',
}

export type BrandBookingSlot = {
  location?: Pick<BrandLocation, 'id'>;
  providers: BrandEmployee[];
  slots: Record<string, number[]>;
};

export type BrandBooking = {
  id: string;
  name: string;
  start: string;
  end: string;
  locations: BrandLocation[];
  employees: BrandEmployee[];
};

export type UnavailableBrandBooking = BrandBooking & {
  type: BrandBookingType.unavailable;
  reason: string;
};

export type BrandBookingClient = BrandClient & {
  free: boolean;
  note: string;
  membership: AnyBrandClientMembership;
};

export type ServiceBrandBooking = BrandBooking & {
  type: BrandBookingType.service;
  places: number;
  reminders: number[];
  cancelAt: string;
  cancelBy: BrandBookingCancelBy;
  clients: BrandBookingClient[];
  services: BrandService[];
};

export type AnyBrandBooking = UnavailableBrandBooking | ServiceBrandBooking;

export type BrandBookingPaginationParams = PaginationListParams & {
  start: Date;
  end?: Date;
  type?: BrandBookingType;
  location?: string;
};

export type ServiceBrandBookingSlotsParams = {
  date: Date;
  location?: string;
};

export type CreateUnavailableBrandBooking = {
  start: Date[];
  reason: string;
  duration: number;
  locations: string[];
  employees: string[];
};

export type CreateServiceBrandBookingClient = {
  id: string;
  free: boolean;
  note: string;
};

export type UpdateServiceBrandBookingClient = {
  free?: boolean;
  note?: string;
  membership?: string;
};

export type CreateServiceBrandBooking = {
  start: Date[];
  places: number;
  duration: number;
  services: string[];
  locations: string[];
  employees: string[];
  reminders: number[];
  clients: CreateServiceBrandBookingClient[];
};

export type UpdateBrandBooking = {
  start?: Date;
  duration?: number;
  following?: boolean;
  locations?: string[];
  employees: string[];
};

export type UpdateUnavailableBrandBooking = UnavailableBrandBooking & {
  reason?: string;
};

export type UpdateServiceBrandBooking = UnavailableBrandBooking & {
  places?: number;
  services?: string[];
  reminders?: number[];
};
