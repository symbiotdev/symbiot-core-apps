import { Link } from './link';
import { Phone } from './phone';
import { Schedule } from './schedule';

export type BrandLocation = {
  id: string;
  name: string;
  country: string;
  usState: string;
  currency: string;
  address: string;
  lat: number;
  lng: number;
  email: string;
  remark: string;
  avatarUrl: string;
  avatarXsUrl: string;
  links: Link[];
  phones: Phone[];
  schedules: Schedule[];
};

export type CreateBrandLocation = {
  name: string;
  country: string;
  usState?: string;
  currency: string;
  address: string;
  lat: number;
  lng: number;
  email?: string;
  remark?: string;
  links: Omit<Link, 'id'>[];
  phones: Phone[];
  schedules: Schedule[];
};
