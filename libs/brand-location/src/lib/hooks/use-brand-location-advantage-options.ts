import { useMemo } from 'react';
import { useBrandLocationAdvantages } from '@symbiot-core-apps/api';

export const useBrandLocationAdvantageOptions = () => {
  const { data: advantages, isPending, error } = useBrandLocationAdvantages();

  const toggleGroupItems = useMemo(
    () =>
      advantages
        ?.sort((a, b) => (a.name > b.name ? 1 : -1))
        ?.sort((a, b) => b.rate - a.rate)
        ?.map((item) => ({
          label: item.name,
          value: item,
        })),
    [advantages],
  );

  return {
    advantages: toggleGroupItems,
    advantagesLoading: isPending,
    advantagesError: error,
  };
};
