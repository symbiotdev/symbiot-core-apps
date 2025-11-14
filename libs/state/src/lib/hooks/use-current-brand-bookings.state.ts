import { AnyBrandBooking, BrandLocation } from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { DateHelper } from '@symbiot-core-apps/shared';

type CurrentBrandBookingsState = {
  location?: BrandLocation;
  bookings?: AnyBrandBooking[];
  clear: () => void;
  setLocation: (location?: BrandLocation) => void;
  addBookings: (bookings: AnyBrandBooking[]) => void;
  removeBookings: (bookings: AnyBrandBooking[]) => void;
  upsertBookings: (bookings: AnyBrandBooking[]) => void;
  syncBookings: (params: {
    start: Date;
    end: Date;
    bookings: AnyBrandBooking[];
  }) => void;
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
      addBookings: (newBookings) => {
        set({
          bookings: [...(get().bookings || []), ...newBookings],
        });
      },
      removeBookings: (bookings) => {
        set({
          bookings: get().bookings?.filter(
            ({ id }) => !bookings.some((booking) => booking.id === id),
          ),
        });
      },
      upsertBookings: (newBookings) => {
        set({
          bookings: [
            ...(get().bookings || []).filter(
              ({ id }) => !newBookings.some((booking) => booking.id === id),
            ),
            ...newBookings,
          ],
        });
      },
      syncBookings: ({ start, end, bookings }) => {
        set({
          bookings: [
            ...(get().bookings || []).filter(
              (booking) =>
                DateHelper.isSameDay(booking.start, start) ||
                DateHelper.isSameDay(booking.end, end),
            ),
            ...bookings,
          ],
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
