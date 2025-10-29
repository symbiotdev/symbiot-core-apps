import { BrandLocation } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandBookingsState = {
  location?: BrandLocation;
  clear: () => void;
  setLocation: (location?: BrandLocation) => void;
};

export const useCurrentBrandBookingsState = create<CurrentBrandBookingsState>()(
  persist<CurrentBrandBookingsState>(
    (set) => ({
      clear: () => {
        set({
          location: undefined,
        });
      },
      setLocation: (location) => set({ location }),
    }),
    {
      name: 'symbiot-current-brand-bookings',
      storage: createZustandStorage(),
    },
  ),
);
