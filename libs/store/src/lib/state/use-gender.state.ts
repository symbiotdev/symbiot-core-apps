import { Gender, useGenderQuery } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo } from 'react';

type GenderState = {
  genders?: Gender[];
  setGenders: (genders: Gender[]) => void;
};

export const useGenderState = create<GenderState>()(
  persist<GenderState>(
    (set) => ({
      setGenders: (genders) => set({ genders }),
    }),
    {
      name: 'genders',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useGenders = () => {
  const { data, isPending, error } = useGenderQuery();
  const { genders, setGenders } = useGenderState();

  const gendersAsOptions = useMemo(
    () =>
      genders
        ? [
            {
              label: '-',
              value: undefined,
            },
            ...genders.map((gender) => ({
              label: gender.name,
              value: gender.id,
            })),
          ]
        : undefined,
    [genders],
  );

  useEffect(() => {
    if (data) {
      setGenders(data);
    }
  }, [data, setGenders]);

  return {
    genders,
    gendersAsOptions,
    loading: isPending,
    error,
  };
};
