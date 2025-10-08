import {
  BrandMembership,
  BrandMembershipType,
} from '../types/brand-membership';

export const getTranslateKeyByBrandMembershipType = (
  type?: BrandMembershipType,
) =>
  type === BrandMembershipType.period
    ? 'brand_period_based_membership'
    : 'brand_visit_based_membership';

export const getBrandMembershipType = (membership: BrandMembership) =>
  membership.type ||
  ('period' in membership
    ? BrandMembershipType.period
    : BrandMembershipType.visits);

export const getTranslateKeyByBrandMembership = (membership: BrandMembership) =>
  getTranslateKeyByBrandMembershipType(getBrandMembershipType(membership));
