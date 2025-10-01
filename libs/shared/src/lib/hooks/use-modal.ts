import { useCallback, useState } from 'react';

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

  const open = useCallback(() => {
    setVisible(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

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
