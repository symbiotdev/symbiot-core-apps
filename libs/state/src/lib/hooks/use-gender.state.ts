import { Gender, useGenderQuery } from '@symbiot-core-apps/api';
import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';
import { useEffect, useMemo } from 'react';
import { createZustandStorage } from '@symbiot-core-apps/storage';

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
      storage: createZustandStorage(),
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
