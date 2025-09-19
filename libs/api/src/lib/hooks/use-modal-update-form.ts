import { useCallback, useRef, useState } from 'react';
import { arraysOfObjectsEqual, objectsEqual } from '@symbiot-core-apps/shared';
import { UseMutationResult } from '@tanstack/react-query';

export function useModalUpdateForm<T, FV, UV>({
  initialValue,
  query,
  dataRequestFormatted,
}: {
  initialValue: FV;
  query: () => UseMutationResult<T, string, Partial<UV>>;
  dataRequestFormatted?: (value: Partial<FV>) => object;
}) {
  const { mutateAsync, isPending } = query();

  return useUpdateForm(
    initialValue,
    isPending,
    mutateAsync,
    dataRequestFormatted,
  );
}

export function useModalUpdateByIdForm<T, FV, UV>({
  id,
  initialValue,
  query,
  dataRequestFormatted,
}: {
  id: string;
  initialValue: FV;
  query: () => UseMutationResult<T, string, { id: string; data: Partial<UV> }>;
  dataRequestFormatted?: (value: Partial<FV>) => object;
}) {
  const { mutateAsync, isPending } = query();

  const update = useCallback(
    (data: Partial<UV>) => mutateAsync({ id, data }),
    [id, mutateAsync],
  );

  return useUpdateForm(initialValue, isPending, update, dataRequestFormatted);
}

export function useUpdateForm<FV, UV>(
  initialValue: FV,
  updating: boolean,
  update: (value: Partial<UV>) => Promise<unknown>,
  dataRequestFormatted?: (value: Partial<FV>) => object,
) {
  const valueRef = useRef<FV>(initialValue);

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState<FV>(initialValue);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const updateValue = useCallback(
    async (data: Partial<FV>) => {
      const dataKeys = Object.keys(data) as (keyof FV)[];

      if (
        dataKeys.every((key) =>
          Array.isArray(data[key]) && Array.isArray(valueRef.current[key])
            ? arraysOfObjectsEqual(data[key], valueRef.current[key])
            : objectsEqual(data[key], valueRef.current[key]),
        )
      )
        return;

      const currentValue = { ...valueRef.current };

      valueRef.current = {
        ...valueRef.current,
        ...data,
      };
      setValue(valueRef.current);

      try {
        await update(dataRequestFormatted ? dataRequestFormatted(data) : data);
      } catch {
        valueRef.current = currentValue;
        setValue(currentValue);

        setTimeout(openModal, 500);
      }
    },
    [update, dataRequestFormatted, openModal],
  );

  return {
    value,
    updating,
    modalVisible,
    openModal,
    closeModal,
    updateValue,
  };
}
