import { useCallback, useRef, useState } from 'react';
import { arraysOfObjectsEqual, objectsEqual } from '@symbiot-core-apps/shared';
import { UseMutationResult } from '@tanstack/react-query';

export function useModalUpdateForm<T, FV, UV>({
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
  const { mutateAsync: update, isPending } = query();

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
        await update({
          id,
          data: dataRequestFormatted ? dataRequestFormatted(data) : data,
        });
      } catch {
        valueRef.current = currentValue;
        setValue(currentValue);

        setTimeout(openModal, 500);
      }
    },
    [update, id, dataRequestFormatted, openModal],
  );

  return {
    value,
    updating: isPending,
    modalVisible,
    openModal,
    closeModal,
    updateValue,
  };
}
