import { useApp } from '@symbiot-core-apps/app';
import {
  useCurrentAccountState,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { useMemo } from 'react';
import { BrandStats } from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';

export const useAccountLimits = () => {
  const { t } = useTranslation();
  const { functionality } = useApp();
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

  const canDo = useMemo(() => {
    const limitByBrandStats = (key: keyof BrandStats) =>
      brand?.stats &&
      limits &&
      limits[key] !== undefined &&
      brand.stats[key] >= limits[key];

    return {
      addClient: !limitByBrandStats('clients'),
      addEmployee: !limitByBrandStats('employees'),
      addLocation: !limitByBrandStats('locations'),
      addService: !limitByBrandStats('services'),
      addPeriodMembership: !limitByBrandStats('periodMemberships'),
      addVisitMembership: !limitByBrandStats('visitMemberships'),
    };
  }, [brand?.stats, limits]);

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

  return {
    used,
    canDo,
    limits,
  };
};
