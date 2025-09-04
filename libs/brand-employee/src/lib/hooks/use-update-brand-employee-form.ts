import { useCallback, useRef, useState } from 'react';
import { arraysOfObjectsEqual, objectsEqual } from '@symbiot-core-apps/shared';
import { useUpdateBrandEmployeeQuery } from '@symbiot-core-apps/api';

export function useUpdateBrandEmployeeForm<V>({
  id,
  initialValue,
  dataRequestFormatted,
}: {
  id: string;
  initialValue: V;
  dataRequestFormatted?: (value: Partial<V>) => object;
}) {
  const { mutateAsync: update, isPending } = useUpdateBrandEmployeeQuery();

  const valueRef = useRef<V>(initialValue);

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState<V>(initialValue);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const updateValue = useCallback(
    async (data: Partial<V>) => {
      const dataKeys = Object.keys(data) as (keyof V)[];

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
