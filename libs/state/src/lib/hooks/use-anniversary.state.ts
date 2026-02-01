import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/shared';

type ById = 'byBrandId' | 'byEmployeeId' | 'byClientId';

type AnniversaryState = {
  byBrandId: Record<string, string>;
  byEmployeeId: Record<string, string>;
  byClientId: Record<string, string>;
  hide: (byId: ById, id: string) => void;
};

export const useAnniversaryState = create<AnniversaryState>()(
  persist<AnniversaryState>(
    (set, get) => ({
      byBrandId: {},
      byEmployeeId: {},
      byClientId: {},
      hide: (byId, id) =>
        set({
          [byId]: {
            ...get()[byId],
            [id]: new Date().toUTCString(),
          },
        }),
    }),
    {
      name: 'symbiot-anniversary',
      storage: createZustandStorage(),
    },
  ),
);
