import { BrandLocation } from './brand-location';
import { BrandEmployee } from './brand-employee';
import { BrandService } from './brand-service';
import { AnyBrandClientMembership, BrandClient } from './brand-client';

export enum BrandBookingType {
  service = 'service',
  unavailable = 'unavailable',
}

export enum BrandBookingFrequency {
  noRepeat = 'noRepeat',
  // specificDates = 'specificDates',
  everyWorkday = 'everyWorkday',
  everyDay = 'everyDay',
  everyWeek = 'everyWeek',
  everyMonth = 'everyMonth',
}

export enum BrandBookingCancelBy {
  brand = 'brand',
  employee = 'employee',
  client = 'client',
}

export type BrandBookingSlot = {
  location?: Pick<BrandLocation, 'id' | 'name'>;
  providers: BrandEmployee[];
  slots: Record<string, number[]>;
};

export type BrandBooking = {
  id: string;
  name: string;
  start: string;
  end: string;
  note: string;
  repetitive: boolean;
  cancelAt: string;
  cancelBy: BrandBookingCancelBy;
  locations: BrandLocation[];
  employees: BrandEmployee[];
};

export type UnavailableBrandBooking = BrandBooking & {
  type: BrandBookingType.unavailable;
};

export type BrandBookingClient = BrandClient & {
  free: boolean;
  note: string;
  membership: AnyBrandClientMembership;
};

export type ServiceBrandBooking = BrandBooking & {
  type: BrandBookingType.service;
  places: number;
  note: string;
  reminders: number[];
  clients: BrandBookingClient[];
  services: BrandService[];
};

export type AnyBrandBooking = UnavailableBrandBooking | ServiceBrandBooking;

export type ServiceBrandBookingSlotsParams = {
  date: Date;
  location?: string;
};

export type CreateUnavailableBrandBooking = {
  start: Date;
  end?: Date;
  frequency: BrandBookingFrequency;
  note?: string;
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
  start: Date;
  frequency: BrandBookingFrequency;
  places?: number;
  duration?: number;
  note?: string;
  services: string[];
  locations: string[];
  employees: string[];
  reminders: number[];
  clients: CreateServiceBrandBookingClient[];
};

export type UpdateBrandBooking = {
  start?: Date | string;
  note?: string;
  duration?: number;
  recurring?: boolean;
  locations?: string[];
};

export type UpdateServiceBrandBooking = UpdateBrandBooking & {
  employees?: string[];
  places?: number;
  note?: string;
  services?: string[];
  reminders?: number[];
};
