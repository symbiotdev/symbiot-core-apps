import { BaseSyntheticEvent, useCallback, useState } from 'react';

export const useModal = ({
  onOpen,
  onClose,
  onToggle,
}: {
  onOpen?: () => void;
  onClose?: () => void;
  onToggle?: () => void;
} = {}) => {
  const [visible, setVisible] = useState(false);

  const open = useCallback(
    (e?: BaseSyntheticEvent) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      setVisible(true);
      onOpen?.();
    },
    [onOpen],
  );

  const close = useCallback(
    (e?: BaseSyntheticEvent) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      setVisible(false);
      onClose?.();
    },
    [onClose],
  );

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
    onToggle?.();
  }, [onToggle]);

  return {
    visible,
    open,
    close,
    toggle,
  };
};
