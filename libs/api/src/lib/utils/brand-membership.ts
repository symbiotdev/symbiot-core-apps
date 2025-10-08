import {
  AnyBrandMembership,
  BrandMembershipType,
} from '../types/brand-membership';
import { AnyBrandClientMembership } from '../types/brand-client';

export const getTranslateKeyByBrandMembershipType = (
  type?: BrandMembershipType,
) =>
  type === BrandMembershipType.period
    ? 'brand_period_based_membership'
    : 'brand_visit_based_membership';

export const getBrandMembershipType = (
  membership: AnyBrandMembership | AnyBrandClientMembership,
) =>
  membership.type ||
  ('period' in membership
    ? BrandMembershipType.period
    : BrandMembershipType.visits);

export const getTranslateKeyByBrandMembership = (
  membership: AnyBrandMembership | AnyBrandClientMembership,
) => getTranslateKeyByBrandMembershipType(getBrandMembershipType(membership));
