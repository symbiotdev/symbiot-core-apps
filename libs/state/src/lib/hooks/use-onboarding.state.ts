import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/shared';

type OnboardingState = {
  finished: boolean;
  finish: () => void;
};

export const useOnboardingState = create<OnboardingState>()(
  persist<OnboardingState>(
    (set) => ({
      finished: false,
      finish: () => set({ finished: true }),
    }),
    {
      name: 'symbiot-onboarding',
      storage: createZustandStorage(),
    },
  ),
);
