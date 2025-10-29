import {
  BrandEmployee,
  BrandEmployeePermissions,
} from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { useCallback, useMemo } from 'react';

type CurrentBrandEmployeeState = {
  currentEmployee?: BrandEmployee;
  clear: () => void;
  setCurrentEmployee: (brandEmployee?: BrandEmployee) => void;
};

export const useCurrentBrandEmployeeState = create<CurrentBrandEmployeeState>()(
  persist<CurrentBrandEmployeeState>(
    (set) => ({
      clear: () => {
        set({
          currentEmployee: undefined,
        });
      },
      setCurrentEmployee: (currentEmployee) => set({ currentEmployee }),
    }),
    {
      name: 'symbiot-current-brand-employee',
      storage: createZustandStorage(),
    },
  ),
);

export const useCurrentBrandEmployee = () => {
  const { currentEmployee, setCurrentEmployee } =
    useCurrentBrandEmployeeState();

  const hasAnyPermission = useMemo(
    () =>
      !!currentEmployee?.permissions &&
      !!Object.values(currentEmployee.permissions).filter(Boolean).length,
    [currentEmployee?.permissions],
  );

  const hasAnyOfPermissions = useCallback(
    (permissions: (keyof BrandEmployeePermissions)[]) =>
      !!currentEmployee?.permissions &&
      permissions.some((key) => currentEmployee.permissions[key]),
    [currentEmployee?.permissions],
  );

  const hasPermission = useCallback(
    (permission: keyof BrandEmployeePermissions) =>
      !!currentEmployee?.permissions?.[permission],
    [currentEmployee?.permissions],
  );

  return {
    currentEmployee,
    setCurrentEmployee,
    hasAnyOfPermissions,
    hasAnyPermission,
    hasPermission,
  };
};
