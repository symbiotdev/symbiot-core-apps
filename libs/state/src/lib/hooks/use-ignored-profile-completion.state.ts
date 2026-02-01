import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/shared';

type ById = 'byBrandId' | 'byLocationId' | 'byEmployeeId' | 'byClientId';

type IgnoredProfileCompletionState = {
  byBrandId: Record<string, string>;
  byLocationId: Record<string, string>;
  byEmployeeId: Record<string, string>;
  byClientId: Record<string, string>;
  ignore: (byId: ById, id: string, date: Date) => void;
};

export const useIgnoredProfileCompletionState =
  create<IgnoredProfileCompletionState>()(
    persist<IgnoredProfileCompletionState>(
      (set, get) => ({
        byBrandId: {},
        byLocationId: {},
        byEmployeeId: {},
        byClientId: {},
        ignore: (byId, id, date) =>
          set({
            [byId]: {
              ...get()[byId],
              [id]: date.toUTCString(),
            },
          }),
      }),
      {
        name: 'symbiot-ignored-profile-completion',
        storage: createZustandStorage(),
      },
    ),
  );
