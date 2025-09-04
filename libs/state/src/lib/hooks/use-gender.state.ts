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
      name: 'symbiot-genders',
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
        ? genders.map((gender) => ({
            label: gender.name,
            value: gender.id,
          }))
        : undefined,
    [genders],
  );

  const gendersAsOptionsWithEmptyOption = useMemo(
    () =>
      gendersAsOptions
        ? [
            {
              label: '-',
              value: undefined,
            },
            ...gendersAsOptions,
          ]
        : undefined,
    [gendersAsOptions],
  );

  useEffect(() => {
    if (data) {
      setGenders(data);
    }
  }, [data, setGenders]);

  return {
    genders,
    gendersAsOptions,
    gendersAsOptionsWithEmptyOption,
    loading: isPending,
    error,
  };
};
