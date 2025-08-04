import { FAQ, useAccountFaqQuery } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { useEffect, useMemo } from 'react';

type FaqState = {
  faq?: FAQ[];
  setFAQ: (faq: FAQ[]) => void;
  clear: () => void;
};

export const useFaqState = create<FaqState>()(
  persist<FaqState>(
    (set) => ({
      setFAQ: (faq) => set({ faq }),
      clear: () => set({ faq: undefined }),
    }),
    {
      name: 'faq',
      storage: createZustandStorage(),
    },
  ),
);

export const useFaq = () => {
  const { data, isPending, error } = useAccountFaqQuery();
  const { faq, setFAQ } = useFaqState();

  const sortedFaq = useMemo(() => faq?.sort((a, b) => b.rate - a.rate), [faq]);

  useEffect(() => {
    if (data) {
      setFAQ(data);
    }
  }, [data, setFAQ]);

  return {
    faq,
    sortedFaq,
    loading: isPending,
    error,
  };
};
