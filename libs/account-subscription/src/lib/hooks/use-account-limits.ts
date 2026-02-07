import { useAppSettings } from '@symbiot-core-apps/app';
import {
  useCurrentAccountState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useCallback, useMemo } from 'react';
import { BrandMembershipType, BrandStats } from '@symbiot-core-apps/api';
import { useI18n } from '@symbiot-core-apps/shared';
import { useAccountSubscription } from '../providers/account-subscription-provider';

export type AccountLimitActions = {
  importClients: boolean;
  addClient: boolean;
  addEmployee: boolean;
  addLocation: boolean;
  addService: boolean;
  addPeriodMembership: boolean;
  addVisitMembership: boolean;
};

export const useAccountLimits = () => {
  const { t } = useI18n();
  const { functionality } = useAppSettings();
  const { hasActualSubscription, showPaywall } = useAccountSubscription();
  const { me } = useCurrentAccountState();
  const { brand } = useCurrentBrandState();

  const limits = useMemo(() => {
    if (!brand?.id || !me?.offering) return {};

    return (
      functionality.limits[
        brand?.subscription && brand.subscription.active
          ? brand.subscription.product
          : 'default'
      ] || {}
    );
  }, [brand?.id, brand?.subscription, me?.offering, functionality.limits]);

  const canDo: AccountLimitActions = useMemo(() => {
    const limitByBrandStats = (key: keyof BrandStats) =>
      brand?.stats &&
      limits &&
      limits[key] !== undefined &&
      brand.stats[key] >= limits[key];

    return {
      importClients: hasActualSubscription,
      addClient: !limitByBrandStats('clients'),
      addEmployee: !limitByBrandStats('employees'),
      addLocation: !limitByBrandStats('locations'),
      addService: !limitByBrandStats('services'),
      addPeriodMembership: !limitByBrandStats('periodMemberships'),
      addVisitMembership: !limitByBrandStats('visitMemberships'),
    };
  }, [brand?.stats, hasActualSubscription, limits]);

  const used = useMemo(() => {
    const byBrandStats = (key: keyof BrandStats) =>
      brand?.stats && limits && limits[key] !== undefined
        ? t(limits[key] <= 0 ? 'shared.limited' : 'shared.used_value', {
            value: `${brand.stats[key]}/${limits[key]}`,
          })
        : undefined;

    return {
      clients: byBrandStats('clients'),
      employees: byBrandStats('employees'),
      locations: byBrandStats('locations'),
      services: byBrandStats('services'),
      periodMemberships: byBrandStats('periodMemberships'),
      visitMemberships: byBrandStats('visitMemberships'),
    };
  }, [brand?.stats, limits, t]);

  const tryAction = useCallback(
    (action: keyof AccountLimitActions, func: () => unknown) =>
      canDo[action] ? func : showPaywall,
    [canDo, showPaywall],
  );

  const getMembershipDetails = useCallback(
    (type: BrandMembershipType) =>
      (type === BrandMembershipType.visits
        ? {
            used: used.visitMemberships,
            limitAction: 'addVisitMembership',
          }
        : {
            used: used.periodMemberships,
            limitAction: 'addPeriodMembership',
          }) as {
        limitAction: keyof AccountLimitActions;
        used?: string;
      },
    [used.periodMemberships, used.visitMemberships],
  );

  return {
    used,
    canDo,
    limits,
    tryAction,
    getMembershipDetails,
  };
};
