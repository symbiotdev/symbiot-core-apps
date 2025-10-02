import {
  BrandEmployee,
  BrandEmployeePermissions,
  PaginationList,
} from '@symbiot-core-apps/api';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createZustandStorage } from '@symbiot-core-apps/storage';
import { useCallback, useMemo } from 'react';

type CurrentBrandEmployeeState = {
  currentEmployee?: BrandEmployee;
  currentList?: PaginationList<BrandEmployee>;
  clear: () => void;
  setCurrentEmployee: (brandEmployee?: BrandEmployee) => void;
  setCurrentList: (employees?: PaginationList<BrandEmployee>) => void;
};

export const useCurrentBrandEmployeeState = create<CurrentBrandEmployeeState>()(
  devtools(
    persist<CurrentBrandEmployeeState>(
      (set) => ({
        clear: () => {
          set({
            currentEmployee: undefined,
            currentList: undefined,
          });
        },
        setCurrentEmployee: (currentEmployee) => set({ currentEmployee }),
        setCurrentList: (currentList) => set({ currentList }),
      }),
      {
        name: 'symbiot-current-brand-employee',
        storage: createZustandStorage(),
      },
    ),
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
