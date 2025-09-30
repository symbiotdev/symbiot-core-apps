import { FAQ } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

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
      name: 'symbiot-faq',
      storage: createZustandStorage(),
    },
  ),
);
