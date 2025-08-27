import { Modal, ModalProps } from 'react-native';
import { PropsWithChildren } from 'react';

export const FullScreenTransparentModal = ({
  children,
  onClose,
  ...modalProps
}: PropsWithChildren<
  ModalProps & {
    visible: boolean;
    onClose: () => void;
  }
>) => (
  <Modal
    transparent
    animationType="none"
    presentationStyle="overFullScreen"
    supportedOrientations={['portrait', 'landscape']}
    onRequestClose={onClose}
    {...modalProps}
  >
    {children}
  </Modal>
);
