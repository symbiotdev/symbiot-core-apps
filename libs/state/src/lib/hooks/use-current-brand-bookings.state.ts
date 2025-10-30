import { AnyBrandBooking, BrandLocation } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';

type CurrentBrandBookingsState = {
  location?: BrandLocation;
  bookings?: AnyBrandBooking[];
  clear: () => void;
  setLocation: (location?: BrandLocation) => void;
  upsertBookings: (bookings: AnyBrandBooking[]) => void;
  removeBookings: (bookings: AnyBrandBooking[]) => void;
};

export const useCurrentBrandBookingsState = create<CurrentBrandBookingsState>()(
  persist<CurrentBrandBookingsState>(
    (set, get) => ({
      bookings: [],
      clear: () => {
        set({
          location: undefined,
          bookings: [],
        });
      },
      setLocation: (location) => set({ location }),
      upsertBookings: (newBookings) => {
        set({
          bookings: [
            ...(get().bookings || []).filter(
              (booking) => !newBookings.some(({ id }) => id === booking.id),
            ),
            ...newBookings,
          ],
        });
      },
      removeBookings: (bookings) => {
        set({
          bookings: get().bookings?.filter(
            (booking) => !bookings.some(({ id }) => id === booking.id),
          ),
        });
      },
    }),
    {
      name: 'symbiot-current-brand-bookings',
      storage: createZustandStorage(),
      partialize: (state) => {
        const { bookings: _, ...storeState } = state;

        return storeState;
      },
    },
  ),
);
