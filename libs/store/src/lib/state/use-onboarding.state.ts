import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OnboardingState = {
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
      name: 'onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
